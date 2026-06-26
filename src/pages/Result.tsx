import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCase } from "../data/days";
import { recordCaseResult, collectCard } from "../storage/storage";
import Screen from "../components/Screen";
import Button from "../components/Button";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { caseId } = useParams();
  const c = getCase(caseId ?? "");

  const state = location.state as { choiceId?: string; viewedIds?: string[] } | null;
  const choiceId = state?.choiceId ?? "";
  const viewedIds = state?.viewedIds ?? [];
  const chosen = c?.choices.find((ch) => ch.id === choiceId);

  const cleared = chosen?.isCorrect ?? false;
  const keyViewedCount = c
    ? c.evidences.filter((ev) => ev.isKey && viewedIds.includes(ev.id)).length
    : 0;
  const foundKeyEvidence = c ? keyViewedCount >= c.starRules.keyEvidenceNeeded : false;
  const bestResponse = chosen?.isBest ?? false;
  const stars = (cleared ? 1 : 0) + (foundKeyEvidence ? 1 : 0) + (bestResponse ? 1 : 0);

  // 연출 단계: 0=시작, 1~3=판정 항목 하나씩, 4=완료(별 채움), 5=팝업
  const [step, setStep] = useState(0);
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [gotNewCard, setGotNewCard] = useState(false);

  useEffect(() => {
    if (!c) return;
    recordCaseResult(
      { caseId: c.id, cleared, foundKeyEvidence, bestResponse, stars },
      c.starWeights
    );
    let isNew = false;
    if (stars >= 1) isNew = collectCard(c.id);
    setGotNewCard(isNew);

    // 순차 연출: 판정 1 → 2 → 3 → 별 채움 → 별 받았으면 카드 팝업(무조건)
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStep(1), 400));
    timers.push(window.setTimeout(() => setStep(2), 900));
    timers.push(window.setTimeout(() => setStep(3), 1400));
    timers.push(window.setTimeout(() => setStep(4), 1900));
    if (stars >= 1) {
      timers.push(window.setTimeout(() => setShowCardPopup(true), 2500));
    }
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  if (!c) return <Screen><p>없는 사건입니다.</p></Screen>;

  const judgements = [
    { ok: cleared, label: "사건 해결", desc: "위험을 올바르게 판단" },
    { ok: foundKeyEvidence, label: "핵심 단서 발견", desc: `핵심 증거 ${keyViewedCount}/${c.starRules.keyEvidenceNeeded}` },
    { ok: bestResponse, label: "최적 대응", desc: "가장 적절한 조치 선택" },
  ];

  // step 4 이상이면 별 다 채움, 아니면 아직 0개
  const shownStars = step >= 4 ? stars : 0;
  const allDone = step >= 4;

  return (
    <Screen>
      <div className="flex flex-col items-center text-center">
        <p className="text-cyan-400 text-xs tracking-[0.2em] mb-6">RESULT</p>

        {/* 별: 연출 완료 시 채워짐 */}
        <div className="text-5xl mb-2 transition-all duration-500">
          <span className="text-amber-400">{"★".repeat(shownStars)}</span>
          <span className="text-slate-700">{"★".repeat(3 - shownStars)}</span>
        </div>
        <p className="text-slate-400 text-sm mb-8 h-5">
          {allDone ? `별 ${stars}개 획득` : "판정 중..."}
        </p>

        {/* 판정 항목: step에 따라 하나씩 등장 */}
        <div className="w-full space-y-2 mb-6">
          {judgements.map((j, idx) => {
            const visible = step >= idx + 1;
            return (
              <div
                key={j.label}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                } ${j.ok ? "bg-emerald-500/10 border-emerald-700" : "bg-slate-800 border-slate-700"}`}
              >
                <span className={`text-lg ${j.ok ? "text-emerald-400" : "text-slate-600"}`}>
                  {j.ok ? "✓" : "✕"}
                </span>
                <div className="text-left">
                  <p className={`font-bold ${j.ok ? "text-emerald-300" : "text-slate-400"}`}>{j.label}</p>
                  <p className="text-slate-500 text-xs">{j.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 연출 끝난 뒤에만 선택/힌트/버튼 노출 */}
        {allDone && (
          <>
            <p className="text-slate-400 text-sm mb-2">
              내 선택: <span className="text-slate-200">{chosen?.text ?? "(없음)"}</span>
            </p>

            {chosen && !chosen.isBest && chosen.hint && (
              <div className="w-full bg-amber-500/10 border border-amber-700 rounded-xl p-4 mb-6 text-left">
                <p className="text-amber-300 text-sm">💡 {chosen.hint}</p>
              </div>
            )}

            <div className="w-full flex flex-col sm:flex-row gap-2 mt-2">
              <Button variant="ghost" onClick={() => navigate(`/analysis/${c.id}`)} className="flex-1">
                다시 도전
              </Button>
              <Button onClick={() => navigate(`/learning/${c.id}`)} className="flex-1">
                학습 카드 확인
              </Button>
              <Button variant="ghost" onClick={() => navigate(`/day/${c.id.split("-")[0].replace("d", "")}`)} className="flex-1">
                목록으로
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 카드 획득 팝업 */}
      {showCardPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
             onClick={() => setShowCardPopup(false)}>
          <div className="bg-slate-800 border-2 border-cyan-500 rounded-2xl p-6 max-w-xs w-full text-center"
               onClick={(e) => e.stopPropagation()}>
            <p className="text-cyan-400 text-xs tracking-[0.2em] mb-4">NEW CARD</p>
            <div className="bg-slate-900 border border-cyan-700 rounded-xl p-5 mb-4">
              <p className="text-3xl mb-3">🛡️</p>
              <p className="text-slate-100 font-bold text-lg mb-1">{c.learning.cardTitle}</p>
              <p className="text-slate-400 text-sm">{c.learning.summary}</p>
            </div>
            <p className="text-amber-300 text-sm mb-4">
              {gotNewCard ? "새 학습 카드를 획득했습니다!" : "이미 보유한 학습 카드입니다"}
            </p>
            <Button onClick={() => setShowCardPopup(false)} className="w-full">
              확인
            </Button>
          </div>
        </div>
      )}
    </Screen>
  );
}

export default Result;