import * as DialogPrimitive from "@radix-ui/react-dialog";
export function Dialog({ open, onOpenChange, children }) { return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>{children}</DialogPrimitive.Root>; }
export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({ className="", ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm"/>
      <div className="fixed inset-0 grid place-items-center p-4">
        <div className={`w-full max-w-3xl rounded-2xl border bg-white dark:bg-slate-900 ${className}`} {...props}/>
      </div>
    </DialogPrimitive.Portal>
  );
}
export function DialogHeader({ className="", ...props }) { return <div className={`p-4 border-b border-slate-200 dark:border-slate-800 ${className}`} {...props}/>; }
export function DialogTitle(props) { return <h2 className="text-lg font-semibold" {...props}/>; }