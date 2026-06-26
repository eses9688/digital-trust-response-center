import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getCase } from "../data/days";
import { recordCaseResult } from "../storage/storage";
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

  // 별 판정 (하드코딩 제거 → isCorrect / isBest 사용)
  const cleared = chosen?.isCorrect ?? false;
  const keyViewedCount = c
    ? c.evidences.filter((ev) => ev.isKey && viewedIds.includes(ev.id)).length
    : 0;
  const foundKeyEvidence = c ? keyViewedCount >= c.starRules.keyEvidenceNeeded : false;
  const bestResponse = chosen?.isBest ?? false;
  const stars = (cleared ? 1 : 0) + (foundKeyEvidence ? 1 : 0) + (bestResponse ? 1 : 0);

  useEffect(() => {
    if (!c) return;
    recordCaseResult(
      { caseId: c.id, cleared, foundKeyEvidence, bestResponse, stars },
      c.starWeights
    );
  }, []);

  if (!c) return <Screen><p>없는 사건입니다.</p></Screen>;

  const judgements = [
    { ok: cleared, label: "사건 해결", desc: "위험을 올바르게 판단" },
    { ok: foundKeyEvidence, label: "핵심 단서 발견", desc: `핵심 증거 ${keyViewedCount}/${c.starRules.keyEvidenceNeeded}` },
    { ok: bestResponse, label: "최적 대응", desc: "가장 적절한 조치 선택" },
  ];

  // caseId "d1-c1" → dayId 추출
  const dayId = c.id.split("-")[0].replace("d", "");

  return (
    <Screen>
      <div className="flex flex-col items-center text-center">
        <p className="text-cyan-400 text-xs tracking-[0.2em] mb-6">RESULT</p>

        <div className="text-5xl mb-2">
          <span className="text-amber-400">{"★".repeat(stars)}</span>
          <span className="text-slate-700">{"★".repeat(3 - stars)}</span>
        </div>
        <p className="text-slate-400 text-sm mb-8">별 {stars}개 획득</p>

        <div className="w-full space-y-2 mb-6">
          {judgements.map((j) => (
            <div
              key={j.label}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                j.ok ? "bg-emerald-500/10 border-emerald-700" : "bg-slate-800 border-slate-700"
              }`}
            >
              <span className={`text-lg ${j.ok ? "text-emerald-400" : "text-slate-600"}`}>
                {j.ok ? "✓" : "✕"}
              </span>
              <div className="text-left">
                <p className={`font-bold ${j.ok ? "text-emerald-300" : "text-slate-400"}`}>{j.label}</p>
                <p className="text-slate-500 text-xs">{j.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-sm mb-2">
          내 선택: <span className="text-slate-200">{chosen?.text ?? "(없음)"}</span>
        </p>

        {chosen && !chosen.isBest && chosen.hint && (
          <div className="w-full bg-amber-500/10 border border-amber-700 rounded-xl p-4 mb-6 text-left">
            <p className="text-amber-300 text-sm">💡 {chosen.hint}</p>
          </div>
        )}

        <div className="w-full flex gap-2 mt-2">
          <Button variant="ghost" onClick={() => navigate(`/analysis/${c.id}`)} className="flex-1">
            다시 도전
          </Button>
          <Button onClick={() => navigate(`/learning/${c.id}`)} className="flex-1">
            학습하기 →
          </Button>
        </div>
      </div>
    </Screen>
  );
}

export default Result;