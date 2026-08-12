import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  monitor?: boolean;
  topBar?: ReactNode;
  overlay?: ReactNode;
};

function Screen({ children, monitor, topBar, overlay }: Props) {
  if (monitor) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center px-6 py-10 gap-2">
        <div className="relative w-full max-w-3xl aspect-[16/9] rounded-2xl border-[10px] border-slate-800 bg-slate-950 shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
          {topBar && (
            <div className="flex-shrink-0 bg-slate-950/95 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
              {topBar}
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-8">{children}</div>
          {overlay}
        </div>
        <div className="w-28 h-4 bg-slate-800 rounded-b-lg" />
        <div className="w-44 h-2 bg-slate-900 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex justify-center">
      <div className="w-full max-w-2xl px-6 py-10">{children}</div>
    </div>
  );
}

export default Screen;
