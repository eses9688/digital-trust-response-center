import { useNavigate, useParams } from "react-router-dom";
import { getCase } from "../data/days";
import Screen from "../components/Screen";
import Button from "../components/Button";

function Learning() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const c = getCase(caseId ?? "");

  if (!c) return <Screen><p>없는 사건입니다.</p></Screen>;

  const { cardTitle, summary, realCase, prevention, reference } = c.learning;
  const dayId = c.id.split("-")[0].replace("d", "");

  return (
    <Screen>
      <p className="text-cyan-400 text-xs tracking-[0.2em] mb-2">LEARNING CARD</p>

      {/* 카드 헤더 (앞면 느낌) */}
      <div className="bg-slate-800 border-2 border-cyan-600 rounded-2xl p-6 mb-6 text-center">
        <p className="text-4xl mb-3">🛡️</p>
        <p className="text-slate-100 font-bold text-xl mb-2">{cardTitle}</p>
        <p className="text-cyan-300 text-sm">{summary}</p>
      </div>

      {/* 학습 내용 */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-4">
        <p className="text-red-400 text-xs tracking-wide mb-2">왜 위험했나</p>
        <p className="text-slate-200 leading-relaxed">{realCase}</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-4">
        <p className="text-emerald-400 text-xs tracking-wide mb-2">예방법</p>
        <p className="text-slate-200 leading-relaxed whitespace-pre-line">{prevention}</p>
      </div>

      <p className="text-slate-500 text-xs mb-8">출처: {reference}</p>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="ghost" onClick={() => navigate("/collection")} className="flex-1">
          카드 도감
        </Button>
        <Button onClick={() => navigate(`/day/${dayId}`)} className="flex-1">
          사건 목록으로
        </Button>
      </div>
    </Screen>
  );
}

export default Learning;