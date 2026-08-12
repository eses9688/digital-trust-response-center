import type { FootprintEntry } from "../engine/types";

type Props = {
  entries: FootprintEntry[];
  onClose: () => void;
};

function HistoryPanel({ entries, onClose }: Props) {
  const sorted = [...entries].sort((a, b) => a.atMinute - b.atMinute);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-slate-100 font-bold mb-4">🕘 방문 기록</p>
        <div className="flex flex-col gap-2">
          {sorted.length === 0 ? (
            <p className="text-slate-600 text-sm">아직 기록이 없습니다.</p>
          ) : (
            sorted.map((entry) => (
              <p key={entry.id} className="text-slate-300 text-sm">
                {entry.atMinute}분 — {entry.label}
              </p>
            ))
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full text-sm px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500 cursor-pointer"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default HistoryPanel;
