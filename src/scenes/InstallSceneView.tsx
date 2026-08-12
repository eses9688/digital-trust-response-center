import { useEffect, useState } from "react";
import type { InstallScene } from "../types/types";
import Screen from "../components/Screen";
import Button from "../components/Button";

const TICK_MS = 120;
const STEP = 8;

type Props = {
  scene: InstallScene;
  onAdvance: (nextSceneId: string) => void;
};

function InstallSceneView({ scene, onAdvance }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) return;
    const timer = setTimeout(
      () => setProgress((p) => Math.min(100, p + STEP)),
      TICK_MS
    );
    return () => clearTimeout(timer);
  }, [progress]);

  const done = progress >= 100;

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <p className="text-4xl">📥</p>
        <p className="text-slate-100 font-bold">{scene.appName}</p>
        <p className="text-slate-500 text-sm">
          {done ? "설치 완료" : "다운로드 중..."}
        </p>

        <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs">{progress}%</p>

        {done && (
          <Button className="mt-2" onClick={() => onAdvance(scene.goTo)}>
            다음
          </Button>
        )}
      </div>
    </Screen>
  );
}

export default InstallSceneView;
