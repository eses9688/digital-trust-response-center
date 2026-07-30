import { useEffect, useState } from "react";
import type { DesktopScene } from "../types/types";
import Screen from "../components/Screen";

type Props = {
  scene: DesktopScene;
  onAdvance: (nextSceneId: string) => void;
};

function DesktopSceneView({ scene, onAdvance }: Props) {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setShowNotification(false);
    const timer = setTimeout(() => setShowNotification(true), 900);
    return () => clearTimeout(timer);
  }, [scene.id]);

  return (
    <Screen>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-4 gap-6 mt-10">
          <button
            onClick={() => onAdvance(scene.goTo)}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="text-4xl bg-slate-900 border border-slate-800 rounded-2xl w-16 h-16 flex items-center justify-center">
              📧
            </div>
            <span className="text-slate-400 text-xs">메일</span>
          </button>
        </div>

        {showNotification && (
          <button
            onClick={() => onAdvance(scene.goTo)}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-left shadow-lg shadow-black/40 cursor-pointer animate-[fadeIn_0.3s_ease-out]"
          >
            <p className="text-slate-100">{scene.notificationText}</p>
          </button>
        )}
      </div>
    </Screen>
  );
}

export default DesktopSceneView;
