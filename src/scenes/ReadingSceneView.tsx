import type { ReadingScene } from "../types/types";
import Screen from "../components/Screen";
import WindowTitleBar from "../components/WindowTitleBar";

type Props = {
  scene: ReadingScene;
  onAdvance: (nextSceneId: string) => void;
  onBack?: () => void;
  onClose: () => void;
};

function ReadingSceneView({ scene, onAdvance, onBack, onClose }: Props) {
  return (
    <Screen
      monitor
      topBar={<WindowTitleBar title="메일" onBack={onBack} onClose={onClose} />}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onAdvance(scene.reportGoTo)}
            className="text-sm px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600 cursor-pointer"
          >
            🗑 삭제
          </button>
          <button
            onClick={() => onAdvance(scene.reportGoTo)}
            className="text-sm px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600 cursor-pointer"
          >
            🚫 차단
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-100 font-bold mb-1">{scene.subject}</p>
          <p className="text-cyan-400 text-sm">{scene.sender}</p>
          <p className="text-slate-500 text-xs mb-4">{scene.date}</p>
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
      </div>
    </Screen>
  );
}

export default ReadingSceneView;
