import type { Metadata } from "next";
import { getMemberSession } from "@/lib/member-session";
import { AdminPollsPanel } from "@/components/admin-polls-panel";

export const metadata: Metadata = {
  title: "Admin Poll Dashboard",
  description: "Create and moderate polls and comments.",
  alternates: {
    canonical: "/admin/polls",
  },
};

export default function AdminPollsPage() {
  const session = getMemberSession();

  if (session.role !== "admin") {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-foreground">Admin access required</h1>
        <p className="mt-2 text-muted-foreground">Sign in with an admin account to manage polls.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Admin</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Poll Management Dashboard</h1>
      <p className="mt-3 text-muted-foreground">Create/schedule polls and moderate community comments.</p>
      <div className="mt-8">
        <AdminPollsPanel />
      </div>
    </section>
  );
}
