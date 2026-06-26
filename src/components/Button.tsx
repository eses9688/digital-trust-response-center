import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
};

function Button({ children, onClick, variant = "primary", className = "" }: ButtonProps) {
  const base =
    "px-6 py-3 font-bold rounded-lg transition-all duration-200 cursor-pointer";

  const variants = {
    primary:
      "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-300 hover:shadow-cyan-400/50 hover:scale-105",
    ghost:
      "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-600",
    danger:
      "bg-red-900/60 text-red-200 border border-red-800 hover:bg-red-800/70 text-sm",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export default Button;