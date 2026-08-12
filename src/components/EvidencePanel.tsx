import type { EvidenceDef } from "../engine/types";

type Props = {
  evidenceDefs: EvidenceDef[];
  found: Set<string>;
  onClose: () => void;
};

function EvidencePanel({ evidenceDefs, found, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-slate-100 font-bold mb-4">
          Evidence {found.size} / {evidenceDefs.length}
        </p>
        <div className="flex flex-col gap-2">
          {evidenceDefs.map((e) => {
            const isFound = found.has(e.id);
            return (
              <p
                key={e.id}
                className={isFound ? "text-cyan-300 text-sm" : "text-slate-600 text-sm"}
              >
                {isFound ? `✓ ${e.label}` : "? ???"}
              </p>
            );
          })}
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

export default EvidencePanel;
