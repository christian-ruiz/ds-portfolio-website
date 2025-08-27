import * as TabsPrimitive from "@radix-ui/react-tabs";
export function Tabs({ defaultValue, children }) { return <TabsPrimitive.Root defaultValue={defaultValue}>{children}</TabsPrimitive.Root>; }
export function TabsList({ className="", ...props }) { return <TabsPrimitive.List className={`inline-flex gap-2 rounded-xl border p-1 ${className}`} {...props}/>; }
export function TabsTrigger({ value, className="", ...props }) {
  return <TabsPrimitive.Trigger value={value} className={`px-3 py-1.5 text-sm rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-slate-100 dark:data-[state=active]:text-slate-900 ${className}`} {...props}/>;
}
export function TabsContent({ value, className="", ...props }) { return <TabsPrimitive.Content value={value} className={className} {...props}/>; }