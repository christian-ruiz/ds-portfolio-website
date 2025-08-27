import React from "react";
const base="inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition border";
const variants={
  default:"bg-slate-900 text-white border-slate-900 hover:opacity-90",
  outline:"bg-transparent text-slate-900 border-slate-300 hover:bg-slate-100 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
  ghost:"bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 border-transparent",
};
export function Button({ variant="default", asChild, className="", ...props }) {
  const Comp = asChild ? "a" : "button";
  return <Comp className={`${base} ${variants[variant]} ${className}`} {...props} />;
}