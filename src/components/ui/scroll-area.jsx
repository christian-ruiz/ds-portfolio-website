// Simple scroll area; Radix root is optional here
export function ScrollArea({ className="", children }) {
    return <div className={`overflow-auto ${className}`}>{children}</div>;
  }