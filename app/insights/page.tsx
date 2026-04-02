import type { Metadata } from "next";
import { InsightsCatalog } from "@/components/insights-catalog";
import { PollsSection } from "@/components/polls-section";

export const metadata: Metadata = {
  title: "Insights",
  description: "Short notes on industrial engineering, optimization, and machine learning applications.",
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    title: "Insights & Articles | Ahmad Salehiyan",
    description: "Short notes on industrial engineering, optimization, and machine learning applications.",
    url: "/insights",
    images: [
      {
        url: "/images/AI.jpg",
        width: 1200,
        height: 630,
        alt: "Insights and articles",
      },
    ],
  },
};

const insights = [
  {
    title: "Machine Learning Algorithm",
    domain: "Machine Learning",
    description:
      "Machine learning (ML) is a type of artificial intelligence (AI) that allows software applications to become more accurate at predicting outcomes without being explicitly programmed to do so. Machine learning algorithms use historical data as input to predict new output values.",
    link: "/blog/machine-learning",
    featured: true,
  },
  {
    title: "Integer Programming",
    domain: "Optimization",
    description:
      "Integer programming expresses the optimization of a linear function subject to a set of linear constraints over integer variables. Learn how to formulate and solve complex planning and optimization problems using integer programming models.",
    link: "/blog/integer-programming",
    featured: true,
  },
  {
    title: "Maintenance Management",
    domain: "Reliability & Operations",
    description:
      "The success of business management in every sector depends a lot on how efficient is maintenance management. In factories, hotels, stores, restaurants, and other facilities, maintenance management plays a key role to ensure operational efficiency of assets and spaces.",
    link: "/blog/maintenance-management",
    featured: true,
  },
  {
    title: "Designing maintenance KPIs that actually influence decisions",
    domain: "Maintenance Analytics",
    description: "How to structure KPIs so they drive actionable insights, not vanity metrics.",
    featured: false,
  },
  {
    title: "When decomposition methods outperform direct optimization",
    domain: "Optimization Methods",
    description: "Understanding when to use Benders, Dantzig-Wolfe, and other decomposition approaches.",
    featured: false,
  },
  {
    title: "Avoiding overfitting in small industrial datasets",
    domain: "Machine Learning",
    description: "Practical techniques for building robust models with limited data.",
    featured: false,
  },
];

export default function InsightsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Insights & Articles</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Practical notes from projects and research
      </h1>

      <InsightsCatalog insights={insights} />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card/50 p-6">
          <h2 className="text-lg font-semibold text-foreground">Posting Cadence</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New article every month: one operations/reliability topic + one analytics/optimization deep dive.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card/50 p-6">
          <h2 className="text-lg font-semibold text-foreground">Topic Clusters</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Structured pathways across three clusters: Maintenance, Optimization, and Machine Learning.
          </p>
        </div>
      </div>
      <PollsSection />
    </section>
  );
}
