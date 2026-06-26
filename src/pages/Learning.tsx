import { useNavigate, useParams } from "react-router-dom";
import { getStage } from "../data/stages";
import Screen from "../components/Screen";
import Button from "../components/Button";

function Learning() {
  const navigate = useNavigate();
  const { stageId } = useParams();
  const stage = getStage(Number(stageId));

  if (!stage) return <Screen><p>없는 스테이지입니다.</p></Screen>;

  const { realCase, prevention, reference } = stage.learning;

  return (
    <Screen>
      <p className="text-cyan-400 text-xs tracking-[0.2em] mb-2">LEARNING</p>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">실제 사례 학습</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-4">
        <p className="text-red-400 text-xs tracking-wide mb-2">왜 위험했나</p>
        <p className="text-slate-200 leading-relaxed">{realCase}</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-4">
        <p className="text-emerald-400 text-xs tracking-wide mb-2">예방법</p>
        <p className="text-slate-200 leading-relaxed whitespace-pre-line">{prevention}</p>
      </div>

      <p className="text-slate-500 text-xs mb-8">출처: {reference}</p>

      <Button onClick={() => navigate("/dashboard")} className="w-full">
        대시보드로 돌아가기
      </Button>
    </Screen>
  );
}

export default Learning;