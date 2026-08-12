import { useState } from "react";
import type { QuizScene } from "../types/types";
import Screen from "../components/Screen";

type Props = {
  scene: QuizScene;
  onAdvance: (nextSceneId: string) => void;
};

function QuizSceneView({ scene, onAdvance }: Props) {
  const [showFeedback, setShowFeedback] = useState(false);

  function handlePick(option: QuizScene["options"][number]) {
    if (option.correct) {
      onAdvance(option.goTo);
    } else {
      setShowFeedback(true);
    }
  }

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <p className="text-slate-100 font-bold text-lg">{scene.question}</p>

        <div className="flex flex-col gap-3">
          {scene.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handlePick(option)}
              className="text-left px-5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-600 cursor-pointer transition-all"
            >
              {option.text}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className="bg-amber-950/30 border border-amber-900 rounded-xl p-4">
            <p className="text-amber-300 text-sm">{scene.wrongFeedback}</p>
          </div>
        )}
      </div>
    </Screen>
  );
}

export default QuizSceneView;
