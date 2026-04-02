import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PollWidget } from "@/components/poll-widget";
import { AuthPanel } from "@/components/auth-panel";
import { MyPollActivity } from "@/components/my-poll-activity";

export const metadata: Metadata = {
  title: "Community Polls",
  description: "Vote on active community polls, explore closed results, and shape upcoming content topics.",
  alternates: {
    canonical: "/polls",
  },
};

export default function PollsPage() {
  const isLoggedIn = Boolean(cookies().get("member_session")?.value);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Community Polls</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Vote, learn, and help prioritize upcoming content
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Polls are public to browse. Members can vote once per poll and unlock result visibility based on poll rules.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PollWidget title="Featured Poll" scope="featured" />
        <PollWidget title="Active Topic Poll" scope="active" />
      </div>

      <div className="mt-8">
        <AuthPanel />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card/50 p-6">
          <h2 className="text-lg font-semibold text-foreground">Closed Poll Snapshot</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Closed polls remain visible for transparency and community learning.
          </p>
          <div className="mt-4">
            <PollWidget title="Recently Closed" scope="closed" compact />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-6">
          <h2 className="text-lg font-semibold text-foreground">My Poll Activity</h2>
          {isLoggedIn ? (
            <div className="mt-3">
              <MyPollActivity />
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to vote, track your participation, and unlock member-only activity history.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
