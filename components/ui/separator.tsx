import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-border", className)} />;
}
