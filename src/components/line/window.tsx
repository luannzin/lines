import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A copy of a line's window in its live piece, with what it stands for written over it. */
export function Window({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className={cn("flex min-w-0 flex-col gap-3", className)}
    >
      <h3 className="text-muted-foreground">{label}</h3>
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[14px] bg-background shadow-[inset_0_0_0_1px_var(--border),0_24px_48px_-24px_rgb(0_0_0/0.6)]">
        {children}
      </div>
    </section>
  );
}
