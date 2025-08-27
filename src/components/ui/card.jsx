export function Card({ className="", ...props }) { return <div className={`rounded-2xl border bg-white dark:bg-slate-900 ${className}`} {...props}/>; }
export function CardHeader({ className="", ...props }) { return <div className={`p-5 border-b border-slate-200/70 dark:border-slate-800/70 ${className}`} {...props}/>; }
export function CardTitle({ className="", ...props }) { return <h3 className={`font-semibold ${className}`} {...props}/>; }
export function CardDescription({ className="", ...props }) { return <p className={`text-sm text-slate-600 dark:text-slate-300 ${className}`} {...props}/>; }
export function CardContent({ className="", ...props }) { return <div className={`p-5 ${className}`} {...props}/>; }
export function CardFooter({ className="", ...props }) { return <div className={`p-5 pt-0 flex items-center ${className}`} {...props}/>; }