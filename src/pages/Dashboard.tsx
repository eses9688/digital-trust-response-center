import { useNavigate } from "react-router-dom";
import { loadProgress, resetProgress } from "../storage/storage";
import { stages } from "../data/stages";
import Screen from "../components/Screen";
import Button from "../components/Button";

function Dashboard() {
  const navigate = useNavigate();
  const progress = loadProgress();

  const totalStars = progress?.stageRecords.reduce((sum, r) => sum + r.stars, 0) ?? 0;
  const unlocked = progress?.unlockedStages ?? [1];
  const clearedCount = progress?.stageRecords.filter((r) => r.stars >= 1).length ?? 0;

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

      {/* 상태 요약 카드 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs mb-1">획득한 별</p>
          <p className="text-amber-400 text-xl font-bold">★ {totalStars} / 21</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs mb-1">해결한 사건</p>
          <p className="text-cyan-400 text-xl font-bold">{clearedCount} / {stages.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs mb-1">진행률</p>
          <p className="text-slate-100 text-xl font-bold">
            {Math.round((clearedCount / 7) * 100)}%
          </p>
        </div>
      </div>

      {/* Stage 목록 */}
      <p className="text-slate-400 text-xs tracking-[0.2em] mb-3">STAGE 목록</p>
      <div className="space-y-3">
        {stages.map((s) => {
          const isUnlocked = unlocked.includes(s.id);
          const record = progress?.stageRecords.find((r) => r.stageId === s.id);
          const stars = record?.stars ?? 0;

          return (
            <div
              key={s.id}
              onClick={() => isUnlocked && navigate(`/briefing/${s.id}`)}
              className={`rounded-xl p-4 border transition-all duration-200 ${
                isUnlocked
                  ? "bg-slate-800 border-slate-700 hover:border-cyan-500 hover:bg-slate-750 cursor-pointer"
                  : "bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono px-2 py-1 rounded ${
                      isUnlocked ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isUnlocked ? `0${s.id}` : "🔒"}
                  </span>
                  <div>
                    <p className="text-slate-100 font-bold">{s.title}</p>
                    <p className="text-slate-500 text-xs">{s.category} · {s.difficulty}</p>
                  </div>
                </div>

                {/* 별 표시 */}
                <div className="text-lg">
                  {isUnlocked ? (
                    <span className="text-amber-400">
                      {"★".repeat(stars)}
                      <span className="text-slate-700">{"★".repeat(3 - stars)}</span>
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs">잠김</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 초기화 (개발용) */}
      <div className="mt-10 pt-4 border-t border-slate-800">
        <Button variant="danger" onClick={handleReset}>
          🗑 진행 기록 초기화 (개발용)
        </Button>
      </div>
    </Screen>
  );
}

export default Dashboard;