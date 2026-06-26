import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getStage } from "../data/stages";
import { recordStageResult } from "../storage/storage";
import Screen from "../components/Screen";
import Button from "../components/Button";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stageId } = useParams();
  const stage = getStage(Number(stageId));

  const state = location.state as { choiceId?: string; viewedIds?: string[] } | null;
  const choiceId = state?.choiceId ?? "";
  const viewedIds = state?.viewedIds ?? [];
  const chosen = stage?.choices.find((ch) => ch.id === choiceId);

  const cleared = choiceId === "ch-report" || choiceId === "ch-block";
  const keyViewedCount = stage
    ? stage.evidences.filter((ev) => ev.isKey && viewedIds.includes(ev.id)).length
    : 0;
  const foundKeyEvidence = stage ? keyViewedCount >= stage.starRules.keyEvidenceNeeded : false;
  const bestResponse = chosen?.isBest ?? false;
  const stars = (cleared ? 1 : 0) + (foundKeyEvidence ? 1 : 0) + (bestResponse ? 1 : 0);

  useEffect(() => {
    if (!stage) return;
    recordStageResult(
      { stageId: stage.id, cleared, foundKeyEvidence, bestResponse, stars },
      stage.starWeights
    );
  }, []);

  if (!stage) return <Screen><p>없는 스테이지입니다.</p></Screen>;

  const judgements = [
    { ok: cleared, label: "사건 해결", desc: "위험을 위험으로 판단" },
    { ok: foundKeyEvidence, label: "핵심 단서 발견", desc: `핵심 증거 ${keyViewedCount}/${stage.starRules.keyEvidenceNeeded}` },
    { ok: bestResponse, label: "최적 대응", desc: "가장 적절한 조치 선택" },
  ];

  return (
    <Screen>
      <div className="flex flex-col items-center text-center">
        <p className="text-cyan-400 text-xs tracking-[0.2em] mb-6">RESULT</p>

        {/* 큰 별 */}
        <div className="text-5xl mb-2">
          <span className="text-amber-400">{"★".repeat(stars)}</span>
          <span className="text-slate-700">{"★".repeat(3 - stars)}</span>
        </div>
        <p className="text-slate-400 text-sm mb-8">별 {stars}개 획득</p>

        {/* 판정 체크리스트 */}
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
                <p className={`font-bold ${j.ok ? "text-emerald-300" : "text-slate-400"}`}>
                  {j.label}
                </p>
                <p className="text-slate-500 text-xs">{j.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-sm mb-2">
          내 선택: <span className="text-slate-200">{chosen?.text ?? "(없음)"}</span>
        </p>

        {/* 힌트 */}
        {chosen && !chosen.isBest && chosen.hint && (
          <div className="w-full bg-amber-500/10 border border-amber-700 rounded-xl p-4 mb-6 text-left">
            <p className="text-amber-300 text-sm">💡 {chosen.hint}</p>
          </div>
        )}

        <Button onClick={() => navigate(`/learning/${stage.id}`)} className="w-full mt-2">
          학습하기 →
        </Button>
      </div>
    </Screen>
  );
}

export default Result;