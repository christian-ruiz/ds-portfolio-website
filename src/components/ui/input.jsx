export function Input({ className="", ...props }) {
    return <input className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 ${className}`} {...props}/>;
  }