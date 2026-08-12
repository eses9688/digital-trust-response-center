import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SummaryScene } from "../types/types";
import Screen from "../components/Screen";
import Button from "../components/Button";

type Props = {
  scene: SummaryScene;
};

function SummarySceneView({ scene }: Props) {
  const navigate = useNavigate();
  const [showHypothetical, setShowHypothetical] = useState(false);
  const [showFootprints, setShowFootprints] = useState(false);
  const footprintTrail = scene.footprintTrail
    ? [...scene.footprintTrail].sort((a, b) => a.atMinute - b.atMinute)
    : [];

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <p className="text-cyan-400 font-bold text-lg">✔ 신고 완료</p>
        <p className="text-slate-100 whitespace-pre-line">
          {scene.incidentSummary}
        </p>

        <div>
          <p className="text-slate-400 mb-2">{scene.whyFooledLabel ?? "왜 속았을까요?"}</p>
          <ul className="flex flex-col gap-1">
            {scene.whyFooled.map((reason, i) => (
              <li key={i} className="text-slate-300">
                • {reason}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-slate-400 mb-2">다음부터는</p>
          <ul className="flex flex-col gap-1">
            {scene.tips.map((tip, i) => (
              <li key={i} className="text-cyan-300">
                ✓ {tip}
              </li>
            ))}
          </ul>
        </div>

        {scene.hypotheticalDamage && scene.hypotheticalDamage.length > 0 && (
          <div className="flex flex-col gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowHypothetical((v) => !v)}
            >
              {showHypothetical ? "닫기" : "만약 신고하지 않았다면?"}
            </Button>
            {showHypothetical && (
              <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-red-300 text-sm mb-1">
                  링크를 눌러 정보를 입력했다면 이런 피해를 입었을 수 있어요:
                </p>
                {scene.hypotheticalDamage.map((line, i) => (
                  <p key={i} className="text-slate-300 text-sm">
                    • {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {footprintTrail.length > 0 && (
          <div className="flex flex-col gap-3">
            <Button variant="ghost" onClick={() => setShowFootprints((v) => !v)}>
              {showFootprints ? "닫기" : "내 행동 기록 보기"}
            </Button>
            {showFootprints && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-slate-400 text-sm mb-1">당신의 디지털 흔적</p>
                {footprintTrail.map((entry) => (
                  <p key={entry.id} className="text-slate-300 text-sm">
                    {entry.atMinute}분 — {entry.label}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <Button className="self-center mt-4" onClick={() => navigate("/")}>
          처음으로
        </Button>
      </div>
    </Screen>
  );
}

export default SummarySceneView;
