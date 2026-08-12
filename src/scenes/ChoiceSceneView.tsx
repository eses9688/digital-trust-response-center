import type { ChoiceScene } from "../types/types";
import Screen from "../components/Screen";
import { channelMeta } from "./channelMeta";

type Props = {
  scene: ChoiceScene;
  onAdvance: (nextSceneId: string) => void;
};

function ChoiceSceneView({ scene, onAdvance }: Props) {
  const meta = channelMeta[scene.channel];

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <div className="text-4xl">{meta.icon}</div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-cyan-400 text-sm mb-3">
            {meta.label} · {scene.sender}
          </p>
          <p className="text-slate-300 whitespace-pre-line leading-relaxed">
            {scene.body.map((segment, i) =>
              segment.type === "link" ? (
                <button
                  key={i}
                  onClick={() => onAdvance(segment.goTo)}
                  className="text-cyan-400 underline underline-offset-2 cursor-pointer"
                >
                  {segment.value}
                </button>
              ) : (
                <span key={i}>{segment.value}</span>
              )
            )}
          </p>
        </div>
        {scene.options.length > 0 && (
          <div className="flex flex-col gap-3">
            {scene.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onAdvance(option.goTo)}
                className="text-left px-5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-600 cursor-pointer transition-all"
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}

export default ChoiceSceneView;
