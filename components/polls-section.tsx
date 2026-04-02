import Link from "next/link";
import { PollWidget } from "@/components/poll-widget";

export function PollsSection() {
  return (
    <section className="mt-12 rounded-xl border border-border/40 bg-card/30 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Community Engagement</p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">Active Community Poll</h2>
        </div>
        <Link href="/polls" className="text-sm text-primary hover:underline">
          View all polls →
        </Link>
      </div>
      <div className="mt-5">
        <PollWidget scope="featured" title="Active Poll" compact />
      </div>
    </section>
  );
}
