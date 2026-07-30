import { useState } from "react";
import type { FakeSiteScene } from "../types/types";
import Screen from "../components/Screen";
import Button from "../components/Button";

type Props = {
  scene: FakeSiteScene;
  onAdvance: (nextSceneId: string) => void;
};

function FakeSiteSceneView({ scene, onAdvance }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [verifiedFields, setVerifiedFields] = useState<Record<string, boolean>>({});

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <p className="text-amber-400 text-xs">oo-shopping-notice.com</p>
        <p className="text-slate-100 font-bold text-lg">{scene.headline}</p>

        <div className="flex flex-col gap-4">
          {scene.fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-1">
              <label className="text-slate-400 text-sm">{field.label}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={values[field.label] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.label]: e.target.value }))
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-700"
                />
                {field.verify && (
                  <button
                    onClick={() =>
                      setVerifiedFields((v) => ({ ...v, [field.label]: true }))
                    }
                    className="px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm hover:border-slate-500 cursor-pointer whitespace-nowrap"
                  >
                    본인인증
                  </button>
                )}
              </div>
              {field.verify && verifiedFields[field.label] && (
                <p className="text-cyan-400 text-sm">✔ 인증되었습니다!</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center mt-4">
          <Button variant="ghost" onClick={() => onAdvance(scene.backGoTo)}>
            뒤로가기
          </Button>
          <Button onClick={() => onAdvance(scene.submitGoTo)}>다음</Button>
        </div>
      </div>
    </Screen>
  );
}

export default FakeSiteSceneView;
