import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { PollWidget } from "@/components/poll-widget";
import { ReadingProgress } from "@/components/reading-progress";

const canonicalPath = "/blog/integer-programming";
const canonicalUrl = `https://ahmadsalehiyan.github.io${canonicalPath}`;

export const metadata: Metadata = {
  title: "Integer Programming Fundamentals",
  description:
    "Master integer programming optimization. Learn formulation, solution methods, real-world applications, and how to solve complex planning problems.",
  keywords:
    "integer programming, linear programming, optimization, branch and bound, cutting plane, operations research",
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    title: "Integer Programming Fundamentals",
    description:
      "Master integer programming optimization. Learn formulation, solution methods, and real-world applications.",
    type: "article",
    url: canonicalPath,
    images: [
      {
        url: "/images/INT.png",
        width: 1200,
        height: 630,
        alt: "Integer Programming Fundamentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Integer Programming Fundamentals",
    description:
      "Master integer programming optimization. Learn formulation, solution methods, and real-world applications.",
    images: ["/images/INT.png"],
  },
};

const publishDate = "March 10, 2024";
const lastUpdated = "March 22, 2026";
const readTime = "10 min read";
const wordCount = "3,200 words";

const tableOfContents = [
  { id: "what-is-ip", label: "What is Integer Programming?" },
  { id: "why-ip-important", label: "Why is Integer Programming Important?" },
  { id: "problem-formulation", label: "Problem Formulation" },
  { id: "solution-methods", label: "Solution Methods" },
  { id: "branch-bound", label: "Branch and Bound" },
  { id: "cutting-plane", label: "Cutting Plane Methods" },
  { id: "applications", label: "Real-World Applications" },
  { id: "challenges", label: "Challenges & Limitations" },
  { id: "software-tools", label: "Software Tools" },
  { id: "future", label: "Future Trends" },
];

const applications = [
  {
    name: "Supply Chain Optimization",
    description:
      "Minimize distribution costs while meeting demand constraints across multiple warehouses and transportation routes.",
  },
  {
    name: "Facility Location",
    description:
      "Determine optimal locations for manufacturing plants, distribution centers, or service facilities to minimize costs.",
  },
  {
    name: "Production Scheduling",
    description:
      "Schedule production across multiple lines with capacity constraints to meet demand while minimizing setup costs.",
  },
  {
    name: "Workforce Scheduling",
    description:
      "Assign employees to shifts while respecting labor agreements and minimizing overtime costs.",
  },
  {
    name: "Portfolio Optimization",
    description:
      "Select optimal investment portfolios subject to budget and risk constraints using binary decision variables.",
  },
];

const limitations = [
  {
    title: "Computational Complexity",
    description:
      "Integer programs are NP-hard, meaning solution time grows exponentially with problem size. A 100-variable integer program can be exponentially harder than a continuous one.",
  },
  {
    title: "Gap Analysis",
    description:
      "The optimality gap between feasible and optimal solutions can be significant. Many real-world problems accept 5-10% gaps due to time constraints.",
  },
  {
    title: "Modeling Challenges",
    description:
      "Formulating complex constraints and disjunctive logic requires sophisticated modeling techniques and deep domain knowledge.",
  },
  {
    title: "Data Quality",
    description:
      "Solution quality depends heavily on data accuracy. Incorrect coefficients or constraints can lead to infeasible or suboptimal models.",
  },
];

export default function IntegerProgrammingPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Integer Programming Fundamentals",
    description:
      "Master integer programming optimization. Learn formulation, solution methods, real-world applications, and how to solve complex planning problems.",
    image: ["https://ahmadsalehiyan.github.io/images/INT.png"],
    datePublished: "2024-03-10",
    dateModified: "2026-03-22",
    author: {
      "@type": "Person",
      name: "Ahmad Salehiyan",
    },
    publisher: {
      "@type": "Person",
      name: "Ahmad Salehiyan",
    },
    mainEntityOfPage: canonicalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ahmadsalehiyan.github.io/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://ahmadsalehiyan.github.io/insights",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Integer Programming Fundamentals",
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main>
      <SeoJsonLd data={[articleSchema, breadcrumbSchema]} />
      <ReadingProgress />
      {/* Breadcrumb */}
      <section className="bg-background px-6 py-4 border-b border-border/40">
        <div className="mx-auto max-w-6xl text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/insights" className="hover:text-foreground">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Integer Programming</span>
        </div>
      </section>

      {/* Hero Section */}
      <section className="border-b border-border/40 bg-gradient-to-b from-background to-background/50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/insights"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <div className="space-y-4">
            <Badge className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10">
              Optimization
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Integer Programming Fundamentals
            </h1>
            <p className="text-lg text-muted-foreground">
              Master the theory and practice of integer programming. Learn how to formulate, solve, and apply IP models to complex optimization problems.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t border-border/40">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Published {publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>{readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📖</span>
                <span>{wordCount}</span>
              </div>
              <span className="text-xs text-muted-foreground/70">Updated {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-background px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Image
            src="/images/INT.png"
            alt="Integer programming optimization visualization"
            width={1400}
            height={800}
            className="w-full rounded-lg border border-border/60 object-cover h-96"
          />
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Integer programming solves discrete optimization problems by finding optimal integer solutions
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 order-2 md:order-1">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-lg border border-border/40 bg-card/50 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h3>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-xs transition-colors hover:text-primary text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="rounded-lg border border-border/40 bg-card/50 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Share Article</h3>
              <div className="space-y-2">
                <a
                  href="https://twitter.com/intent/tweet?text=Integer Programming Fundamentals&url=https://ahmadsalehiyan.com/blog/integer-programming"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  → Share on Twitter
                </a>
                <a
                  href="https://www.linkedin.com/sharing/share-offsite/?url=https://ahmadsalehiyan.com/blog/integer-programming"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  → Share on LinkedIn
                </a>
                <a
                  href="mailto:?subject=Check out: Integer Programming Fundamentals&body=https://ahmadsalehiyan.com/blog/integer-programming"
                  className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  → Share via Email
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Article Content */}
        <article className="md:col-span-3 order-1 md:order-2 space-y-8">
          <section id="what-is-ip" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">What is Integer Programming?</h2>
            <p className="leading-relaxed text-muted-foreground">
              Integer programming (IP) is a mathematical optimization technique that finds the best solution to a
              problem with constraints, where some or all variables must take integer values. Unlike linear programming
              (LP), which allows variables to take any real value, IP restricts variables to integers (0, 1, 2, ...).
            </p>
            <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
              <div className="flex gap-3">
                <span className="text-primary flex-shrink-0 mt-0.5">💡</span>
                <div className="text-sm space-y-2">
                  <p className="font-semibold text-foreground">Key Takeaway</p>
                  <p className="text-muted-foreground">
                    Integer programming is essential for decision problems: Should we build a facility? (yes/no = 0/1)
                    How many units to produce? (integer quantities). How to assign people to shifts? (discrete
                    assignments).
                  </p>
                </div>
              </div>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              Integer programming problems fall into three categories: Pure integer programs (all variables integer),
              Mixed-integer programs (some variables integer, others continuous), and Binary integer programs (variables
              restricted to 0 or 1).
            </p>
          </section>

          <Separator />

          <section id="why-ip-important" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Why is Integer Programming Important?</h2>
            <p className="leading-relaxed text-muted-foreground">
              Most real-world decisions involve discrete choices: build or don't build, hire or don't hire, produce
              integer quantities. Linear programming alone cannot capture these discrete decisions because it relaxes
              integer constraints, leading to fractional solutions that are impossible to implement in practice.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Integer programming has transformed operations research by enabling organizations to solve complex
              planning, scheduling, and resource allocation problems optimally or near-optimally. The method combines
              mathematical rigor with practical applicability across industries.
            </p>
          </section>

          <Separator />

          <section id="problem-formulation" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Problem Formulation</h2>
            <p className="leading-relaxed text-muted-foreground">
              An integer program has the standard form of a linear program but with the additional constraint that some
              or all variables must be integers:
            </p>
            <div className="bg-card/50 border border-border/40 rounded-lg p-4 space-y-2 text-sm font-mono text-muted-foreground">
              <p>Minimize/Maximize: c₁x₁ + c₂x₂ + ... + cₙxₙ</p>
              <p>Subject to:</p>
              <p className="ml-4">a₁₁x₁ + a₁₂x₂ + ... + a₁ₙxₙ ≤ b₁</p>
              <p className="ml-4">a₂₁x₁ + a₂₂x₂ + ... + a₂ₙxₙ ≤ b₂</p>
              <p className="ml-4">...</p>
              <p className="ml-4">xⱼ ≥ 0 and integer for all j</p>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              The challenge is efficiently finding the optimal integer solution. Unlike LP problems which can be solved
              in polynomial time, general integer programs are NP-hard.
            </p>
          </section>

          <Separator />

          <section id="solution-methods" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Solution Methods</h2>
            <p className="leading-relaxed text-muted-foreground">
              Several approaches exist for solving integer programs, ranging from exact methods (guaranteed optimal) to
              heuristics (good solutions, not guaranteed optimal).
            </p>

            <div id="branch-bound" className="space-y-3 scroll-mt-20">
              <h3 className="text-xl font-semibold text-foreground">Branch and Bound</h3>
              <p className="leading-relaxed text-muted-foreground">
                The most common exact algorithm for integer programming. It works by solving a sequence of LP
                relaxations (removing integer constraints), then branching on fractional variables to create tighter
                subproblems until an integer solution is found.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Process: Solve LP relaxation → If fractional, branch on fractional variable → Recursively solve
                subproblems → Prune nodes with worse bounds
              </p>
            </div>

            <div id="cutting-plane" className="space-y-3 scroll-mt-20">
              <h3 className="text-xl font-semibold text-foreground">Cutting Plane Methods</h3>
              <p className="leading-relaxed text-muted-foreground">
                These methods add constraints (cuts) to the LP relaxation that eliminate fractional solutions but do
                not eliminate any integer solutions. Gomory cuts and other cutting planes tighten the feasible region
                until an integer solution emerges.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Often combined with branch-and-bound for enhanced performance (branch-and-cut algorithms)
              </p>
            </div>
          </section>

          <Separator />

          <section id="applications" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Real-World Applications</h2>
            <div className="space-y-4">
              {applications.map((app, idx) => (
                <div key={idx} className="rounded-lg border border-border/40 bg-card/30 p-4">
                  <h4 className="font-semibold text-foreground mb-2">{app.name}</h4>
                  <p className="text-sm text-muted-foreground">{app.description}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section id="challenges" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Challenges & Limitations</h2>
            <p className="leading-relaxed text-muted-foreground">
              While powerful, integer programming has practical limitations:
            </p>
            <div className="space-y-3">
              {limitations.map((limit, idx) => (
                <div key={idx} className="rounded-lg border-l-4 border-red-500/40 bg-red-500/5 p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    {limit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{limit.description}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section id="software-tools" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Software Tools</h2>
            <p className="leading-relaxed text-muted-foreground">
              Modern integer programming relies on specialized solvers that implement state-of-the-art algorithms:
            </p>
            <ul className="space-y-2 ml-4 text-muted-foreground text-sm">
              <li>
                <strong className="text-foreground">CPLEX (IBM)</strong> — Industry standard, very fast for large
                problems
              </li>
              <li>
                <strong className="text-foreground">Gurobi</strong> — Cutting-edge performance, widely used in
                academia and industry
              </li>
              <li>
                <strong className="text-foreground">GLPK</strong> — Open-source, good for smaller problems
              </li>
              <li>
                <strong className="text-foreground">SCIP</strong> — Academic solver, extensible and powerful
              </li>
              <li>
                <strong className="text-foreground">PuLP/Pyomo (Python)</strong> — Python interfaces for modeling and
                solving
              </li>
            </ul>
          </section>

          <Separator />

          <section id="future" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Future Trends</h2>
            <p className="leading-relaxed text-muted-foreground">
              The future of integer programming involves hybrid approaches combining traditional optimization with
              machine learning, quantum computing for certain problem classes, and integration with constraint
              programming. Modern solvers continue to improve, enabling real-time optimization in domains like
              autonomous vehicles and smart logistics.
            </p>
          </section>
        </article>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <PollWidget
          title="Was this article helpful?"
          scope="active"
          topic="optimization"
          articleSlug="integer-programming"
        />
      </section>

      {/* Related Topics */}
      <section className="border-t border-border/40 bg-background/50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground">Explore Related Topics</h2>
            <p className="mt-2 text-muted-foreground">Deep dive into optimization techniques and decision modeling.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/blog/machine-learning" className="group">
              <Card className="h-full hover:border-primary transition-colors">
                <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                  <Image
                    src="/images/AI.jpg"
                    alt="Machine Learning"
                    width={640}
                    height={320}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Machine Learning Fundamentals
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Explore ML algorithms, supervised/unsupervised learning, and AI applications across industries.
                  </p>
                </div>
              </Card>
            </Link>
            <Link href="/blog/maintenance-management" className="group">
              <Card className="h-full hover:border-primary transition-colors">
                <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                  <Image
                    src="/images/maintenance.jpg"
                    alt="Maintenance Management"
                    width={640}
                    height={320}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Maintenance Management
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Learn best practices for asset reliability, maintenance strategies, and operational efficiency.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-card/40 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Need Help with Optimization?</h2>
          <p className="text-muted-foreground">
            Let's discuss how integer programming can solve your complex planning and optimization challenges.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
            >
              Let's Work Together
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center justify-center text-sm font-medium border border-input bg-transparent hover:bg-muted h-11 rounded-md px-8"
            >
              View More Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
