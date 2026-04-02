import Link from "next/link";
import type { Route } from "next";

const startHere = [
  {
    title: "Operations & Reliability",
    description: "Start here if you need maintenance KPI architecture, CMMS reporting structure, or reliability diagnostics.",
    href: "/blog/maintenance-management",
  },
  {
    title: "Optimization & Planning",
    description: "Explore integer programming and decomposition methods for planning, routing, and scheduling.",
    href: "/blog/integer-programming",
  },
  {
    title: "AI & Predictive Analytics",
    description: "See practical machine learning pathways for prediction, anomaly detection, and decision support.",
    href: "/blog/machine-learning",
  },
];

const services = [
  "Maintenance Analytics Architecture",
  "Optimization Model Design (MIP, Benders, D-W)",
  "Predictive Maintenance Pilot Development",
  "Decision-Support Dashboarding",
];

const outcomes = [
  { label: "KPI visibility improvement", value: "+40%" },
  { label: "Maintenance decision cycle speed", value: "2x faster" },
  { label: "Reporting consistency across teams", value: "+60%" },
  { label: "Issue-detection responsiveness", value: "up to 70%" },
];

const institutions = [
  "Oklahoma State University",
  "K.N. Toosi University of Technology",
  "Industrial Operations Projects",
  "Reliability & Analytics Research",
];

const testimonials = [
  {
    quote:
      "Ahmad translates complex operational issues into clear analytical frameworks that teams can execute.",
    source: "Research Collaborator",
  },
  {
    quote:
      "His optimization mindset helped us move from ad-hoc decisions to structured planning and measurable outcomes.",
    source: "Operations Partner",
  },
];

const publicationsAndTalks = [
  "Reliability modeling and data-driven maintenance planning (ongoing PhD research)",
  "Applied decomposition methods in integer optimization workflows",
  "Practical ML for industrial maintenance and decision support",
];

export function GrowthSections() {
  return (
    <>
      <section className="border-t border-border/40 bg-background px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Start Here</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Pick your fastest path</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {startHere.map((item) => (
              <Link key={item.title} href={item.href as Route} className="rounded-lg border border-border bg-card/50 p-5 transition-colors hover:border-primary/40 hover:bg-card">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-4 text-xs font-medium text-primary">Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-card/30 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">What I Help With</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Service packages</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {services.map((service) => (
                <li key={service}>• {service}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Measured Outcomes</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Impact snapshot</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {outcomes.map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-background/70 p-4">
                  <p className="text-xl font-semibold text-primary">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-background px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Research & Collaboration Context</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {institutions.map((item) => (
              <div key={item} className="rounded-md border border-border/70 bg-card/40 px-4 py-3 text-xs text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-card/20 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Recommendations</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Social proof</h2>
            <div className="mt-4 space-y-4">
              {testimonials.map((item) => (
                <blockquote key={item.quote} className="rounded-lg border border-border bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">“{item.quote}”</p>
                  <footer className="mt-2 text-xs text-foreground">— {item.source}</footer>
                </blockquote>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Publications & Talks</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Knowledge assets</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {publicationsAndTalks.map((item) => (
                <li key={item} className="rounded-lg border border-border bg-background/70 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
            <a href="/files/one-page-profile.md" download className="mt-4 inline-block text-sm text-primary hover:underline">
              Download one-page profile →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
