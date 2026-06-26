import { useNavigate, useParams } from "react-router-dom";
import { getDay } from "../data/days";
import Screen from "../components/Screen";
import Button from "../components/Button";
import { loadProgress, checkDayClear } from "../storage/storage";

const diffLabel: Record<string, string> = { easy: "EASY", medium: "MEDIUM", hard: "HARD" };
const diffColor: Record<string, string> = {
  easy: "bg-emerald-500/20 text-emerald-300",
  medium: "bg-amber-500/20 text-amber-300",
  hard: "bg-red-500/20 text-red-300",
};

function DayView() {
  const navigate = useNavigate();
  const { dayId } = useParams();
  const day = getDay(Number(dayId));
  const progress = loadProgress();

  if (!day) return <Screen><p>없는 DAY입니다.</p></Screen>;
  checkDayClear(day.id, day.cases.map((c) => c.id));

  const clearedCount = day.cases.filter((c) => {
    const rec = progress?.caseRecords.find((r) => r.caseId === c.id);
    return rec && rec.stars >= 1;
  }).length;
  const allCleared = clearedCount === day.cases.length;

  return (
    <Screen>
      <button
        onClick={() => navigate("/dashboard")}
        className="text-slate-500 text-sm mb-4 hover:text-slate-300 cursor-pointer"
      >
        ← 대시보드
      </button>

      <p className="text-cyan-400 text-xs tracking-[0.2em] mb-2">DAY {day.id}</p>
      <h1 className="text-2xl font-bold text-slate-100 mb-1">{day.title}</h1>
      <p className="text-slate-400 text-sm mb-6">{day.goal}</p>

      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-xs tracking-[0.2em]">접수된 사건</p>
        <p className="text-slate-400 text-xs">
          해결 <span className="text-cyan-400 font-bold">{clearedCount}</span> / {day.cases.length}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {day.cases.map((c, idx) => {
          const rec = progress?.caseRecords.find((r) => r.caseId === c.id);
          const stars = rec?.stars ?? 0;
          const cleared = stars >= 1;

          return (
            <div
              key={c.id}
              onClick={() => navigate(`/briefing/${c.id}`)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer
                         hover:border-cyan-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs font-mono">CASE {idx + 1}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${diffColor[c.difficulty]}`}>
                  {diffLabel[c.difficulty]}
                </span>
              </div>
              <p className="text-slate-100 font-bold text-sm mb-1">{c.title}</p>
              <p className="text-slate-500 text-xs mb-3">{c.category}</p>
              <div className="text-amber-400 text-sm">
                {cleared ? (
                  <>
                    {"★".repeat(stars)}
                    <span className="text-slate-700">{"★".repeat(3 - stars)}</span>
                  </>
                ) : (
                  <span className="text-slate-600 text-xs">미해결</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allCleared && (
        <div className="mt-8 bg-cyan-950/40 border border-cyan-800 rounded-xl p-4 text-center">
          <p className="text-cyan-300 font-bold mb-3">✓ DAY {day.id} 클리어!</p>
          <Button onClick={() => navigate("/dashboard")}>대시보드로 돌아가기</Button>
        </div>
      )}
    </Screen>
  );
}

export default DayView;