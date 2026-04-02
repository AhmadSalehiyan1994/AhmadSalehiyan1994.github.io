import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BlogSection() {
  const blogArticles = [
    {
      title: "Machine Learning Algorithm",
      description: "Explore machine learning fundamentals, supervised and unsupervised learning methods, and hybrid AI approaches.",
      image: "AI.jpg",
      link: "/blog/machine-learning",
      overlayTag: "MACHINE LEARNING INSIGHTS",
      overlayTitle: "Learning from Data, Driving Better Decisions",
    },
    {
      title: "Integer Programming",
      description: "Dive deep into integer programming, branch-and-bound, decomposition methods like Dantzig-Wolfe.",
      image: "INT.png",
      link: "/blog/integer-programming",
    },
    {
      title: "Maintenance Management",
      description: "Work order management, maintenance reporting, KPI tracking, and operational excellence.",
      image: "maintenance.jpg",
      link: "/blog/maintenance-management",
    },
  ];

  return (
    <section className="border-t border-border/40 bg-background px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start gap-4">
          <Badge variant="outline" className="rounded-md border-primary/30 bg-primary/5 text-primary">
            My Blog
          </Badge>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Latest Articles
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Research, insights, and lessons learned from reliability engineering, optimization, and data science.
            </p>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {blogArticles.map((article, idx) => (
            <Link key={idx} href={article.link as Route} className="group">
              <Card className="overflow-hidden border-border/60 bg-card/50 backdrop-blur transition-all hover:border-primary/40 hover:bg-card/80">
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={`/images/${article.image}`}
                    alt={article.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {article.overlayTag && article.overlayTitle ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/90">
                          {article.overlayTag}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-tight text-white drop-shadow-sm">
                          {article.overlayTitle}
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {article.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary">
                    Read More →
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            More articles coming soon. Subscribe to stay updated.{" "}
            <Link href="/insights" className="font-medium text-primary hover:underline">
              View all →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
