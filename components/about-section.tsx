import { siteContent } from "@/lib/content";

export function AboutSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Positioning</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Analytical systems for operational reliability</h2>
        </div>
        <div className="md:col-span-8">
          <p className="max-w-3xl text-pretty leading-8 text-muted-foreground">
            {siteContent.person.shortBio} My academic foundation in reliability engineering and stochastic modeling, combined with practical implementation experience, enables me to bridge theory and application.
          </p>
          <p className="mt-4 max-w-3xl text-pretty leading-8 text-muted-foreground">
            <strong className="text-foreground">Current research focus:</strong> Reliability engineering, data-driven decision making, and optimization methods for industrial systems.
          </p>
        </div>
      </div>
    </section>
  );
}
