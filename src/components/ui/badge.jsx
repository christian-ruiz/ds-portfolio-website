export function Badge({ variant="secondary", className="", ...props }) {
    const styles = variant==="secondary" ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100" : "border";
    return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${styles} ${className}`} {...props}/>;
  }