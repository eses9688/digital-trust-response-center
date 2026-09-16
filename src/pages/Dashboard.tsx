import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { episodeCatalog } from "../data/episodeCatalog";
import { tips } from "../data/tips";
import Screen from "../components/Screen";
import Button from "../components/Button";

function stars(difficulty: number): string {
  return "★".repeat(difficulty) + "☆".repeat(3 - difficulty);
}

function Dashboard() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((current) => {
        if (tips.length <= 1) return current;
        let next = current;
        while (next === current) {
          next = Math.floor(Math.random() * tips.length);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const selected = episodeCatalog[selectedIndex];

  return (
    <Screen>
      <div className="flex flex-col gap-10">
        <div className="text-center relative">
          <button
            onClick={() => navigate("/collection")}
            className="absolute right-0 top-0 text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600 cursor-pointer"
          >
            📖 도감
          </button>
          <p className="text-slate-100 font-bold text-2xl tracking-widest">DTRC</p>
          <p className="text-cyan-400 text-sm mt-1">Digital Trust Response Center</p>
          <p className="text-slate-500 text-sm mt-4">
            디지털 사고를 안전하게 경험하고
            <br />
            예방 방법을 배우는 플랫폼입니다.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-slate-400 text-sm text-center">Episode Selection</p>
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
              disabled={selectedIndex === 0}
              className="text-slate-400 text-2xl px-2 disabled:opacity-20 cursor-pointer disabled:cursor-default"
            >
              ◀
            </button>

            <div className="flex gap-4">
              {episodeCatalog.map((entry, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedIndex(index)}
                    className={`flex flex-col items-center gap-2 w-28 py-6 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-950/30"
                        : "border-slate-800 bg-slate-900"
                    } ${entry.locked ? "opacity-50" : ""}`}
                  >
                    <span className="text-3xl">{entry.icon}</span>
                    <span className="text-slate-100 text-sm font-bold">
                      {entry.title}
                    </span>
                    <span className="text-amber-400 text-xs">
                      {stars(entry.difficulty)}
                    </span>
                    {entry.locked && (
                      <span className="text-slate-500 text-xs">준비중</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setSelectedIndex((i) => Math.min(episodeCatalog.length - 1, i + 1))
              }
              disabled={selectedIndex === episodeCatalog.length - 1}
              className="text-slate-400 text-2xl px-2 disabled:opacity-20 cursor-pointer disabled:cursor-default"
            >
              ▶
            </button>
          </div>

          <div className="flex justify-center mt-2">
            {selected.locked ? (
              <Button variant="ghost" className="opacity-50 cursor-default">
                준비중입니다
              </Button>
            ) : (
              <Button onClick={() => navigate(`/episode/${selected.id}`)}>
                체험 시작하기
              </Button>
            )}
          </div>
        </div>

        <p className="text-slate-500 text-xs text-center">{tips[tipIndex]}</p>
      </div>
    </Screen>
  );
}

export default Dashboard;
