import { useState } from "react";
import type { ResponseScene } from "../types/types";
import Screen from "../components/Screen";
import Button from "../components/Button";

type Props = {
  scene: ResponseScene;
  onAdvance: (nextSceneId: string) => void;
};

function ResponseSceneView({ scene, onAdvance }: Props) {
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const allDone = doneIds.length === scene.actions.length;

  function toggle(actionId: string) {
    setDoneIds((prev) =>
      prev.includes(actionId) ? prev : [...prev, actionId]
    );
  }

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <p className="text-slate-100 font-bold text-lg">대응 절차를 수행하세요</p>
        <div className="flex flex-col gap-3">
          {scene.actions.map((action) => {
            const done = doneIds.includes(action.id);
            return (
              <button
                key={action.id}
                onClick={() => toggle(action.id)}
                disabled={done}
                className={`text-left px-5 py-3 rounded-lg border transition-all ${
                  done
                    ? "bg-cyan-950/40 border-cyan-700 text-cyan-300"
                    : "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600 cursor-pointer"
                }`}
              >
                {done ? "✔ " : ""}
                {action.label}
              </button>
            );
          })}
        </div>
        {allDone && (
          <Button className="self-center" onClick={() => onAdvance(scene.goTo)}>
            신고하러 가기
          </Button>
        )}
      </div>
    </Screen>
  );
}

export default ResponseSceneView;
