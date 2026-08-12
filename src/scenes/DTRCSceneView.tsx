import { useState } from "react";
import type { DTRCScene } from "../types/types";
import Screen from "../components/Screen";
import Button from "../components/Button";

type Props = {
  scene: DTRCScene;
  onAdvance: (nextSceneId: string) => void;
};

function DTRCSceneView({ scene, onAdvance }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <p className="text-cyan-400 text-sm tracking-widest">
          Digital Trust Response Center
        </p>
        <div className="border-t border-slate-800" />
        <p className="text-slate-100 font-bold">{scene.intro}</p>
        <div className="flex flex-col gap-2">
          {scene.incidentTypes.map((type) => (
            <button
              key={type.label}
              onClick={() => setSelected(type.label)}
              className={`text-left px-5 py-3 rounded-lg border transition-all cursor-pointer ${
                selected === type.label
                  ? "bg-cyan-950/40 border-cyan-600 text-cyan-300"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600"
              }`}
            >
              <p>
                {selected === type.label ? "☑ " : "☐ "}
                {type.label}
              </p>
              <p className="text-slate-500 text-xs mt-1">{type.description}</p>
            </button>
          ))}
        </div>

        {scene.damageTypes && scene.damageTypes.length > 0 && (
          <div>
            <p className="text-slate-400 text-sm mb-2">피해 내용</p>
            <div className="flex flex-col gap-1">
              {scene.damageTypes.map((label) => (
                <p key={label} className="text-slate-300 text-sm">
                  ☑ {label}
                </p>
              ))}
            </div>
          </div>
        )}

        <Button
          className="self-center"
          onClick={() => selected && onAdvance(scene.goTo)}
        >
          신고하기
        </Button>
      </div>
    </Screen>
  );
}

export default DTRCSceneView;
