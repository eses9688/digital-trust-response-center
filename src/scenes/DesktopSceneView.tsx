import { useEffect, useState } from "react";
import type { DesktopScene } from "../types/types";
import Screen from "../components/Screen";

type Props = {
  scene: DesktopScene;
  onAdvance: (nextSceneId: string) => void;
  notificationVisible: boolean;
  onNotificationShown: () => void;
};

function DesktopSceneView({
  scene,
  onAdvance,
  notificationVisible,
  onNotificationShown,
}: Props) {
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (!notificationVisible) return;
    const timer = setTimeout(() => {
      setBannerVisible(true);
      onNotificationShown();
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationVisible]);

  return (
    <Screen
      monitor
      overlay={
        bannerVisible && (
          <button
            onClick={() => onAdvance(scene.notificationGoTo)}
            className="absolute bottom-4 right-4 max-w-[70%] bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-left shadow-lg shadow-black/40 cursor-pointer"
          >
            <p className="text-slate-100 text-xs">{scene.notificationText}</p>
          </button>
        )
      }
    >
      <div className="grid grid-cols-4 gap-6 mt-6">
        {scene.apps.map((app) => (
          <button
            key={app.label}
            onClick={() => onAdvance(app.goTo)}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="text-4xl bg-slate-900 border border-slate-800 rounded-2xl w-16 h-16 flex items-center justify-center">
              {app.icon}
            </div>
            <span className="text-slate-400 text-xs">{app.label}</span>
          </button>
        ))}
      </div>
    </Screen>
  );
}

export default DesktopSceneView;
