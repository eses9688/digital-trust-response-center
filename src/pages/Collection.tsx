import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { episodeCatalog } from "../data/episodeCatalog";
import episode1 from "../data/episodes/episode1";
import episode2 from "../data/episodes/episode2";
import episode3 from "../data/episodes/episode3";
import { loadCollectedCards } from "../storage/storage";
import type { Episode } from "../types/types";
import Screen from "../components/Screen";
import Button from "../components/Button";

const episodes: Record<string, Episode> = {
  ep1: episode1,
  ep2: episode2,
  ep3: episode3,
};

function Collection() {
  const navigate = useNavigate();
  const [collected] = useState(() => loadCollectedCards());
  const [openId, setOpenId] = useState<string | null>(null);

  const openEpisode = openId ? episodes[openId] : undefined;
  const collectibleCount = episodeCatalog.filter((e) => !e.locked).length;

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-slate-500 text-sm hover:text-slate-300 cursor-pointer self-start"
        >
          ← 대시보드
        </button>

        <div>
          <p className="text-cyan-400 text-xs tracking-[0.2em] mb-2">CARD COLLECTION</p>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">학습 카드 도감</h1>
          <p className="text-slate-400 text-sm">
            수집 <span className="text-cyan-400 font-bold">{collected.length}</span> /{" "}
            {collectibleCount}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {episodeCatalog.map((entry) => {
            const has = !entry.locked && collected.includes(entry.id);
            return (
              <button
                key={entry.id}
                onClick={() => has && setOpenId(entry.id)}
                className={`rounded-xl p-4 border text-center transition-all duration-200 ${
                  has
                    ? "bg-slate-900 border-cyan-700 hover:border-cyan-500 cursor-pointer"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                {has ? (
                  <>
                    <p className="text-3xl mb-2">{entry.icon}</p>
                    <p className="text-slate-100 text-sm font-bold leading-tight">
                      {entry.title}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl mb-2 opacity-30">❔</p>
                    <p className="text-slate-600 text-sm">
                      {entry.locked ? "준비중" : "미획득"}
                    </p>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {openEpisode?.learningCard && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
          onClick={() => setOpenId(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-cyan-400 text-xs tracking-widest mb-2">LEARNING CARD</p>
            <p className="text-slate-100 font-bold text-lg mb-4">
              {openEpisode.learningCard.cardTitle}
            </p>

            <p className="text-red-400 text-xs tracking-wide mb-2">왜 위험했나</p>
            <ul className="flex flex-col gap-1 mb-4">
              {openEpisode.learningCard.whyDangerous.map((reason, i) => (
                <li key={i} className="text-slate-300 text-sm">
                  • {reason}
                </li>
              ))}
            </ul>

            <p className="text-emerald-400 text-xs tracking-wide mb-2">예방법</p>
            <ul className="flex flex-col gap-1 mb-4">
              {openEpisode.learningCard.prevention.map((tip, i) => (
                <li key={i} className="text-cyan-300 text-sm">
                  ✓ {tip}
                </li>
              ))}
            </ul>

            <p className="text-slate-500 text-xs mb-5">
              {openEpisode.learningCard.reference}
            </p>

            <Button variant="ghost" className="w-full" onClick={() => setOpenId(null)}>
              닫기
            </Button>
          </div>
        </div>
      )}
    </Screen>
  );
}

export default Collection;
