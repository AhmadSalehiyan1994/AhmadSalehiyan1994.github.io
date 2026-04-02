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

const canonicalPath = "/blog/maintenance-management";
const canonicalUrl = `https://ahmadsalehiyan.github.io${canonicalPath}`;

export const metadata: Metadata = {
  title: "Maintenance Management Fundamentals",
  description:
    "Complete guide to maintenance management strategies, KPIs, predictive maintenance, and operational reliability. Learn best practices for asset management.",
  keywords:
    "maintenance management, predictive maintenance, asset management, reliability, maintenance strategies, operational excellence",
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    title: "Maintenance Management Fundamentals",
    description:
      "Complete guide to maintenance management strategies, KPIs, predictive maintenance, and operational reliability.",
    type: "article",
    url: canonicalPath,
    images: [
      {
        url: "/images/baner.png",
        width: 1200,
        height: 630,
        alt: "Maintenance Management Fundamentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maintenance Management Fundamentals",
    description:
      "Complete guide to maintenance management strategies, KPIs, predictive maintenance, and operational reliability.",
    images: ["/images/baner.png"],
  },
};

const publishDate = "February 28, 2024";
const lastUpdated = "March 22, 2026";
const readTime = "13 min read";
const wordCount = "3,950 words";

const tableOfContents = [
  { id: "what-is-maintenance", label: "What is Maintenance Management?" },
  { id: "why-maintenance-critical", label: "Why is Maintenance Critical?" },
  { id: "maintenance-strategies", label: "Maintenance Strategies" },
  { id: "reactive-maintenance", label: "Reactive (Corrective) Maintenance" },
  { id: "preventive-maintenance", label: "Preventive Maintenance" },
  { id: "predictive-maintenance", label: "Predictive Maintenance" },
  { id: "maintenance-kpis", label: "Key Performance Indicators" },
  { id: "planning-implementation", label: "Planning & Implementation" },
  { id: "challenges", label: "Common Challenges" },
  { id: "future-outlook", label: "Future Outlook" },
];

const strategies = [
  {
    name: "Reactive Maintenance",
    description: "Address failures as they occur. Low upfront cost but high unplanned downtime and emergency repair costs.",
  },
  {
    name: "Preventive Maintenance",
    description:
      "Schedule maintenance at fixed intervals. Reduces breakdowns but may lead to over-maintenance and unnecessary component replacement.",
  },
  {
    name: "Predictive Maintenance",
    description:
      "Use data and sensors to predict failures before they occur. Optimal timing reduces downtime and extends asset life, but requires data infrastructure.",
  },
  {
    name: "Condition-Based Maintenance",
    description:
      "Perform maintenance based on real-time asset condition. Balances cost and reliability but requires monitoring systems.",
  },
];

const kpis = [
  {
    name: "Mean Time Between Failures (MTBF)",
    description: "Average time between equipment failures. Higher MTBF indicates better reliability.",
  },
  {
    name: "Mean Time To Repair (MTTR)",
    description:
      "Average time to repair a failed asset. Shorter MTTR means faster recovery from failures and less production loss.",
  },
  {
    name: "Overall Equipment Effectiveness (OEE)",
    description:
      "Combines availability, performance, and quality metrics. Industry target is 85%+ for world-class manufacturing.",
  },
  {
    name: "Maintenance Cost Ratio",
    description: "Total maintenance cost as percentage of asset replacement value. Typically 15-40% depending on industry.",
  },
  {
    name: "Planned vs Unplanned Maintenance Ratio",
    description:
      "Percentage of maintenance that is planned vs reactive. Target: 80% planned, 20% reactive for optimal performance.",
  },
];

const challenges = [
  {
    title: "Budget Constraints",
    description:
      "Maintenance is often viewed as a cost center rather than value creator. Inadequate budgets lead to deferred maintenance and accumulating technical debt.",
  },
  {
    title: "Skilled Labor Shortage",
    description:
      "Finding technicians with expertise in modern equipment is increasingly difficult. Training and retention are critical but time-consuming.",
  },
  {
    title: "Legacy Systems",
    description:
      "Older equipment with limited documentation and spare parts availability increases maintenance difficulty and downtime risk.",
  },
  {
    title: "Data Integration",
    description:
      "Implementing predictive maintenance requires integrating data from multiple sources. Fragmented systems and poor data quality hamper effectiveness.",
  },
];

export default function MaintenanceManagementPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Maintenance Management Fundamentals",
    description:
      "Complete guide to maintenance management strategies, KPIs, predictive maintenance, and operational reliability.",
    image: ["https://ahmadsalehiyan.github.io/images/baner.png"],
    datePublished: "2024-02-28",
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
        name: "Maintenance Management Fundamentals",
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
          <span className="text-foreground">Maintenance Management</span>
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
              Reliability & Operations
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Maintenance Management Fundamentals
            </h1>
            <p className="text-lg text-muted-foreground">
              Master asset reliability, maintenance strategies, and operational excellence. Learn proven frameworks for
              reducing downtime and maximizing asset performance.
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
            src="/images/baner.png"
            alt="Maintenance management operations and asset reliability"
            width={1400}
            height={800}
            className="w-full rounded-lg border border-border/60 object-cover h-96"
          />
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Effective maintenance management ensures continuous asset performance and operational reliability
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
                  href="https://twitter.com/intent/tweet?text=Maintenance Management Fundamentals&url=https://ahmadsalehiyan.com/blog/maintenance-management"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  → Share on Twitter
                </a>
                <a
                  href="https://www.linkedin.com/sharing/share-offsite/?url=https://ahmadsalehiyan.com/blog/maintenance-management"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  → Share on LinkedIn
                </a>
                <a
                  href="mailto:?subject=Check out: Maintenance Management Fundamentals&body=https://ahmadsalehiyan.com/blog/maintenance-management"
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
          <section id="what-is-maintenance" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">What is Maintenance Management?</h2>
            <p className="leading-relaxed text-muted-foreground">
              Maintenance management is the discipline of planning, executing, and monitoring all activities required to
              keep equipment, assets, and facilities in optimal working condition. It encompasses reactive repairs,
              preventive maintenance, predictive monitoring, and continuous improvement of asset reliability.
            </p>
            <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
              <div className="flex gap-3">
                <span className="text-primary flex-shrink-0 mt-0.5">💡</span>
                <div className="text-sm space-y-2">
                  <p className="font-semibold text-foreground">Key Definition</p>
                  <p className="text-muted-foreground">
                    Maintenance management combines technical expertise, planning discipline, and data-driven decision
                    making to maximize asset availability, minimize total cost of ownership, and ensure operational
                    safety.
                  </p>
                </div>
              </div>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              In modern industrial operations, maintenance is no longer a necessary evil—it's a strategic function that
              directly impacts profitability, safety, and competitiveness.
            </p>
          </section>

          <Separator />

          <section id="why-maintenance-critical" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Why is Maintenance Critical?</h2>
            <p className="leading-relaxed text-muted-foreground">
              Equipment failures don't just cost money to fix—they disrupt production, anger customers, create safety
              hazards, and damage reputation. The strategic importance of maintenance includes:
            </p>
            <ul className="space-y-2 ml-4 text-muted-foreground">
              <li>
                <strong className="text-foreground">Availability:</strong> Ensures equipment operates when needed
              </li>
              <li>
                <strong className="text-foreground">Safety:</strong> Prevents accidents and worker injuries
              </li>
              <li>
                <strong className="text-foreground">Quality:</strong> Maintains product consistency and reduces defects
              </li>
              <li>
                <strong className="text-foreground">Cost Control:</strong> Reduces unplanned downtime and expensive
                emergency repairs
              </li>
              <li>
                <strong className="text-foreground">Asset Life:</strong> Extends equipment lifespan and ROI
              </li>
            </ul>
          </section>

          <Separator />

          <section id="maintenance-strategies" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Maintenance Strategies</h2>
            <p className="leading-relaxed text-muted-foreground">
              Organizations typically employ a mix of four maintenance approaches, each with distinct advantages and
              cost-benefit profiles:
            </p>

            <div className="space-y-4">
              {strategies.map((strategy, idx) => (
                <div key={idx} className="rounded-lg border border-border/40 bg-card/30 p-4">
                  <h4 className="font-semibold text-foreground mb-2">{strategy.name}</h4>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
              ))}
            </div>

            <div id="reactive-maintenance" className="space-y-3 scroll-mt-20">
              <h3 className="text-xl font-semibold text-foreground">Reactive (Corrective) Maintenance</h3>
              <p className="leading-relaxed text-muted-foreground">
                The "break and fix" approach: equipment fails, then you repair it. While low in preventive costs, this
                strategy leads to high unplanned downtime, expensive emergency repairs, and potential safety issues.
              </p>
            </div>

            <div id="preventive-maintenance" className="space-y-3 scroll-mt-20">
              <h3 className="text-xl font-semibold text-foreground">Preventive Maintenance</h3>
              <p className="leading-relaxed text-muted-foreground">
                Scheduled maintenance at fixed intervals (e.g., every 1000 hours or 3 months). Reduces unexpected
                failures but may result in over-maintenance or under-maintenance depending on actual asset condition.
              </p>
            </div>

            <div id="predictive-maintenance" className="space-y-3 scroll-mt-20">
              <h3 className="text-xl font-semibold text-foreground">Predictive Maintenance</h3>
              <p className="leading-relaxed text-muted-foreground">
                Uses real-time data from sensors, vibration analysis, thermography, and machine learning to predict
                failures before they occur. Allows optimal maintenance timing, reduces downtime, and extends asset life.
                This is the modern ideal but requires investment in monitoring infrastructure.
              </p>
            </div>
          </section>

          <Separator />

          <section id="maintenance-kpis" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Key Performance Indicators (KPIs)</h2>
            <p className="leading-relaxed text-muted-foreground">
              Effective maintenance management relies on measuring and tracking the right metrics:
            </p>

            <div className="space-y-4">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="rounded-lg border border-border/40 bg-card/30 p-4">
                  <h4 className="font-semibold text-foreground mb-2">{kpi.name}</h4>
                  <p className="text-sm text-muted-foreground">{kpi.description}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section id="planning-implementation" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Planning & Implementation</h2>
            <p className="leading-relaxed text-muted-foreground">
              Transitioning to world-class maintenance requires systematic planning:
            </p>
            <ol className="space-y-3 ml-4 text-muted-foreground">
              <li>
                <strong className="text-foreground">1. Inventory Assets:</strong> Document all equipment with
                specifications, failure history, and criticality ranking
              </li>
              <li>
                <strong className="text-foreground">2. Establish Baselines:</strong> Measure current MTBF, MTTR, OEE,
                and maintenance costs
              </li>
              <li>
                <strong className="text-foreground">3. Develop Strategy:</strong> Choose maintenance approaches
                appropriate for each asset's criticality
              </li>
              <li>
                <strong className="text-foreground">4. Implement Systems:</strong> Adopt CMMS (Computerized
                Maintenance Management Systems) for planning and tracking
              </li>
              <li>
                <strong className="text-foreground">5. Train Teams:</strong> Ensure technicians understand new
                procedures and tools
              </li>
              <li>
                <strong className="text-foreground">6. Monitor & Adjust:</strong> Track KPIs and continuously improve
              </li>
            </ol>
          </section>

          <Separator />

          <section id="challenges" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Common Challenges</h2>
            <p className="leading-relaxed text-muted-foreground">
              Organizations typically encounter several obstacles when implementing maintenance best practices:
            </p>

            <div className="space-y-3">
              {challenges.map((challenge, idx) => (
                <div key={idx} className="rounded-lg border-l-4 border-red-500/40 bg-red-500/5 p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section id="future-outlook" className="space-y-4 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground">Future Outlook</h2>
            <p className="leading-relaxed text-muted-foreground">
              The future of maintenance management is being shaped by emerging technologies: IoT sensors enable
              continuous condition monitoring, AI/ML algorithms predict failures with increasing accuracy, digital
              twins allow simulation and optimization, and mobile platforms connect field technicians with centralized
              expertise.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Organizations that master the fundamentals today—systematic planning, reliable data, skilled teams—will
              be best positioned to leverage these technologies tomorrow.
            </p>
          </section>
        </article>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <PollWidget
          title="Was this article helpful?"
          scope="active"
          topic="maintenance"
          articleSlug="maintenance-management"
        />
      </section>

      {/* Related Topics */}
      <section className="border-t border-border/40 bg-background/50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground">Explore Related Topics</h2>
            <p className="mt-2 text-muted-foreground">Deep dive into operations, reliability, and strategic planning.</p>
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
                    Leverage ML for predictive analytics, anomaly detection, and data-driven decision making.
                  </p>
                </div>
              </Card>
            </Link>
            <Link href="/blog/integer-programming" className="group">
              <Card className="h-full hover:border-primary transition-colors">
                <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                  <Image
                    src="/images/INT.png"
                    alt="Integer Programming"
                    width={640}
                    height={320}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Integer Programming
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Optimize maintenance scheduling, resource allocation, and complex planning problems.
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
          <h2 className="text-2xl font-bold text-foreground">Transform Your Maintenance Operations</h2>
          <p className="text-muted-foreground">
            Let's discuss how to implement best practices and maximize asset reliability in your operations.
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
