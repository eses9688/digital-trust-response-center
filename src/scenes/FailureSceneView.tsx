import { useNavigate } from "react-router-dom";
import type { FailureScene } from "../types/types";
import Screen from "../components/Screen";
import Button from "../components/Button";

type Props = {
  scene: FailureScene;
  onRestart: (sceneId: string) => void;
};

function FailureSceneView({ scene, onRestart }: Props) {
  const navigate = useNavigate();

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <p className="text-red-400 font-bold text-lg">✕ 실패</p>
        <p className="text-slate-100 whitespace-pre-line">{scene.message}</p>
        <p className="text-slate-400 text-sm">{scene.hint}</p>

        <div className="flex flex-col gap-3 mt-2">
          <Button onClick={() => onRestart(scene.restartSceneId)}>
            다시 도전하기
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            처음으로
          </Button>
        </div>
      </div>
    </Screen>
  );
}

export default FailureSceneView;
