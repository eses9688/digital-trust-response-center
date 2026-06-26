import { useNavigate } from "react-router-dom";
import { days } from "../data/days";
import { loadProgress } from "../storage/storage";
import Screen from "../components/Screen";

function Collection() {
  const navigate = useNavigate();
  const progress = loadProgress();
  const collected = progress?.collectedCards ?? [];

  // 전체 카드 = 모든 Day의 모든 사건
  const allCases = days.flatMap((d) => d.cases);
  const collectedCount = allCases.filter((c) => collected.includes(c.id)).length;

  return (
    <Screen>
      <button
        onClick={() => navigate("/dashboard")}
        className="text-slate-500 text-sm mb-4 hover:text-slate-300 cursor-pointer"
      >
        ← 대시보드
      </button>

      <p className="text-cyan-400 text-xs tracking-[0.2em] mb-2">CARD COLLECTION</p>
      <h1 className="text-2xl font-bold text-slate-100 mb-1">학습 카드 도감</h1>
      <p className="text-slate-400 text-sm mb-6">
        수집 <span className="text-cyan-400 font-bold">{collectedCount}</span> / {allCases.length}
      </p>

      {days.map((d) => (
        <div key={d.id} className="mb-6">
          <p className="text-slate-400 text-xs tracking-[0.2em] mb-3">
            DAY {d.id} · {d.title}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {d.cases.map((c) => {
              const has = collected.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => has && navigate(`/learning/${c.id}`)}
                  className={`rounded-xl p-4 border text-center transition-all duration-200 ${
                    has
                      ? "bg-slate-800 border-cyan-700 hover:border-cyan-500 cursor-pointer"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  {has ? (
                    <>
                      <p className="text-2xl mb-2">🛡️</p>
                      <p className="text-slate-100 text-sm font-bold leading-tight">
                        {c.learning.cardTitle}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl mb-2 opacity-30">❔</p>
                      <p className="text-slate-600 text-sm">미획득</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Screen>
  );
}

export default Collection;