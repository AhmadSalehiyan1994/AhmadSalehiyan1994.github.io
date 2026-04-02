import Link from "next/link";
import { getMemberSession } from "@/lib/member-session";

export default function AdminOperationsPage() {
  const session = getMemberSession();

  if (session.role !== "admin") {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Admin required</h1>
        <p className="mt-2 text-sm text-muted-foreground">You need an admin session to access operations endpoints.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Admin Operations</h1>
      <p className="mt-3 text-sm text-muted-foreground">Operational APIs for support workflows and backend maintenance.</p>

      <div className="mt-8 space-y-3 rounded-lg border border-border bg-card/50 p-5">
        <p className="font-medium">Operational API endpoints</p>
        <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
          <li><code>GET /api/admin/ops/contact?page=1&pageSize=20</code></li>
          <li><code>GET /api/admin/ops/client-errors?page=1&pageSize=20</code></li>
          <li><code>POST /api/admin/jobs/run</code> (requires CSRF header)</li>
        </ul>
      </div>

      <div className="mt-8">
        <Link href="/admin/polls" className="text-sm underline underline-offset-4">
          Back to polls admin
        </Link>
      </div>
    </section>
  );
}
