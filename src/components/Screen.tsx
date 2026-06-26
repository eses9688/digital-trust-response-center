import type { ReactNode } from "react";

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex justify-center">
      <div className="w-full max-w-2xl px-6 py-10">{children}</div>
    </div>
  );
}

export default Screen;