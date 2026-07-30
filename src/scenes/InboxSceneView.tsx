import type { InboxScene } from "../types/types";
import Screen from "../components/Screen";

type Props = {
  scene: InboxScene;
  onAdvance: (nextSceneId: string) => void;
};

function InboxSceneView({ scene, onAdvance }: Props) {
  return (
    <Screen>
      <div className="flex flex-col gap-4">
        <p className="text-slate-100 font-bold text-lg">받은편지함</p>
        <div className="flex flex-col border-t border-slate-800">
          {scene.emails.map((email) => (
            <button
              key={email.id}
              onClick={() => onAdvance(email.goTo)}
              className="text-left px-2 py-4 border-b border-slate-800 hover:bg-slate-900 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-slate-100 font-bold">{email.sender}</span>
                <span className="text-slate-500 text-xs">방금 전</span>
              </div>
              <p className="text-slate-200 text-sm mt-1">{email.subject}</p>
              <p className="text-slate-500 text-sm truncate">{email.preview}</p>
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}

export default InboxSceneView;
