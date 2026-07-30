import { useEffect, useState } from "react";
import type { DamageScene } from "../types/types";
import Screen from "../components/Screen";
import Button from "../components/Button";
import { channelMeta } from "./channelMeta";

const STEP_DELAY_MS = 900;

type Props = {
  scene: DamageScene;
  onAdvance: (nextSceneId: string) => void;
};

function DamageSceneView({ scene, onAdvance }: Props) {
  const [shownCount, setShownCount] = useState(1);
  const allShown = shownCount >= scene.events.length;

  useEffect(() => {
    if (shownCount >= scene.events.length) return;
    const timer = setTimeout(() => setShownCount((c) => c + 1), STEP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [shownCount, scene]);

  return (
    <Screen>
      <div className="flex flex-col gap-4">
        {scene.events.slice(0, shownCount).map((event, index) => {
          const meta = channelMeta[event.channel];
          return (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <p className="text-cyan-400 text-sm mb-1">
                {meta.icon} {event.sender}
              </p>
              <p className="text-slate-200">{event.text}</p>
            </div>
          );
        })}
        {allShown && (
          <Button className="self-center mt-4" onClick={() => onAdvance(scene.goTo)}>
            다음
          </Button>
        )}
      </div>
    </Screen>
  );
}

export default DamageSceneView;
