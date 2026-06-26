import { useNavigate, useParams } from "react-router-dom";
import { getCase } from "../data/days";
import Screen from "../components/Screen";
import Button from "../components/Button";

function Briefing() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const c = getCase(caseId ?? "");

  if (!c) return <Screen><p>없는 사건입니다.</p></Screen>;

  return (
    <Screen>
      <p className="text-cyan-400 text-xs tracking-[0.2em] mb-2">CASE BRIEFING</p>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-300">
          {c.category}
        </span>
        <span className="text-slate-500 text-xs">{c.difficulty}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-100 mb-6">{c.title}</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">
        <p className="text-slate-400 text-xs mb-2">신고 내용</p>
        <p className="text-slate-200 leading-relaxed">{c.briefing}</p>
      </div>

      <Button onClick={() => navigate(`/analysis/${c.id}`)}>분석 시작 →</Button>
    </Screen>
  );
}

export default Briefing;