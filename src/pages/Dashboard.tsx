import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadProgress, resetProgress } from "../storage/storage";
import { days } from "../data/days";
import Screen from "../components/Screen";
import Button from "../components/Button";

function Dashboard() {
  const navigate = useNavigate();
  const progress = loadProgress();

  const unlocked = progress?.unlockedDays ?? [1];
  const totalStars = progress?.caseRecords?.reduce((sum, r) => sum + r.stars, 0) ?? 0;

  const clearedDays = days.filter((d) =>
    d.cases.every((c) => {
      const rec = progress?.caseRecords?.find((r) => r.caseId === c.id);
      return rec && rec.stars >= 1;
    })
  ).length;

  // 캐러셀: 현재 보고 있는 Day 인덱스 (해금된 마지막 Day에서 시작)
  const lastUnlocked = Math.max(...unlocked);
  const [current, setCurrent] = useState(
    Math.max(0, days.findIndex((d) => d.id === lastUnlocked))
  );

  const day = days[current];
  const isUnlocked = unlocked.includes(day.id);
  const clearedCases = day.cases.filter((c) => {
    const rec = progress?.caseRecords?.find((r) => r.caseId === c.id);
    return rec && rec.stars >= 1;
  }).length;

  function prev() {
    setCurrent((i) => Math.max(0, i - 1));
  }
  function next() {
    setCurrent((i) => Math.min(days.length - 1, i + 1));
  }

  function handleReset() {
    if (window.confirm("모든 진행 기록을 초기화할까요? (개발용)")) {
      resetProgress();
      window.location.reload();
    }
  }

  return (
    <Screen>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-cyan-400 text-xs tracking-[0.2em]">CASE BOARD</p>
        <p className="text-slate-400 text-sm">분석관: {progress?.nickname ?? "게스트"}</p>
      </div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">사건 관리 시스템</h1>

      {/* 상태 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs mb-1">획득한 별</p>
          <p className="text-amber-400 text-xl font-bold">★ {totalStars}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs mb-1">완료한 DAY</p>
          <p className="text-cyan-400 text-xl font-bold">{clearedDays} / 7</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs mb-1">진행률</p>
          <p className="text-slate-100 text-xl font-bold">{Math.round((clearedDays / 7) * 100)}%</p>
        </div>
      </div>

      <p className="text-slate-400 text-xs tracking-[0.2em] mb-3">DAY 선택</p>

      {/* 캐러셀 */}
      <div className="flex items-center gap-3">
        {/* 이전 버튼 */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="text-3xl text-slate-500 hover:text-cyan-400 disabled:opacity-20
                     disabled:hover:text-slate-500 cursor-pointer disabled:cursor-not-allowed px-1"
        >
          ‹
        </button>

        {/* 가운데 메인 카드 */}
        <div className="flex-1">
          <div
            className={`rounded-2xl p-6 border-2 transition-all duration-200 ${
              isUnlocked
                ? "bg-slate-800 border-cyan-600"
                : "bg-slate-900 border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-sm font-mono px-3 py-1 rounded ${
                  isUnlocked ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-500"
                }`}
              >
                {isUnlocked ? `DAY ${day.id}` : `🔒 DAY ${day.id}`}
              </span>
              {isUnlocked && (
                <span className="text-slate-400 text-xs">
                  사건 <span className="text-cyan-400 font-bold">{clearedCases}</span> / {day.cases.length}
                </span>
              )}
            </div>

            <h2 className={`text-xl font-bold mb-2 ${isUnlocked ? "text-slate-100" : "text-slate-500"}`}>
              {day.title}
            </h2>
            <p className="text-slate-400 text-sm mb-6 min-h-[2.5rem]">{day.goal}</p>

            {isUnlocked ? (
              <Button onClick={() => navigate(`/day/${day.id}`)} className="w-full">
                입장하기 →
              </Button>
            ) : (
              <div className="w-full text-center py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 text-sm">
                이전 DAY를 완료하면 열립니다
              </div>
            )}
          </div>

          {/* 페이지 인디케이터 */}
          <div className="flex justify-center gap-1.5 mt-4">
            {days.map((d, i) => (
              <span
                key={d.id}
                className={`w-2 h-2 rounded-full transition ${
                  i === current
                    ? "bg-cyan-400"
                    : unlocked.includes(d.id)
                    ? "bg-slate-500"
                    : "bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={next}
          disabled={current === days.length - 1}
          className="text-3xl text-slate-500 hover:text-cyan-400 disabled:opacity-20
                     disabled:hover:text-slate-500 cursor-pointer disabled:cursor-not-allowed px-1"
        >
          ›
        </button>
      </div>

      {/* 초기화 */}
      <div className="mt-10 pt-4 border-t border-slate-800">
        <Button variant="danger" onClick={handleReset}>
          🗑 진행 기록 초기화 (개발용)
        </Button>
      </div>
    </Screen>
  );
}

export default Dashboard;