import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/lib/content";

export function ContactCta() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Let’s Build Something Useful</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Need support on reliability, analytics, or optimization?</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">I work with teams that need structured decisions, practical models, and production-minded analysis.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact">
            <Button size="lg">Start a Conversation</Button>
          </Link>
          <Link href={`mailto:${siteContent.person.email}`}>
            <Button variant="outline" size="lg">Email Directly</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
