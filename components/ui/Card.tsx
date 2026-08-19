import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  glass = false,
}: {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[color:var(--border-soft)] p-8 shadow-[0_20px_60px_-30px_rgba(43,36,32,0.35)] transition-transform duration-300",
        glass ? "glass-panel" : "bg-[color:var(--surface)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
