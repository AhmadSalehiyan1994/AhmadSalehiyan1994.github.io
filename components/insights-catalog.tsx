"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type InsightItem = {
  title: string;
  domain: string;
  description: string;
  link?: string;
  featured: boolean;
};

type InsightsCatalogProps = {
  insights: InsightItem[];
};

export function InsightsCatalog({ insights }: InsightsCatalogProps) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");

  const domains = useMemo(() => ["All", ...new Set(insights.map((item) => item.domain))], [insights]);

  const filtered = useMemo(
    () =>
      insights.filter((item) => {
        const matchesQuery =
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase());
        const matchesDomain = domain === "All" || item.domain === domain;
        return matchesQuery && matchesDomain;
      }),
    [domain, insights, query],
  );

  const featuredInsights = filtered.filter((item) => item.featured);
  const draftInsights = filtered.filter((item) => !item.featured);

  return (
    <>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles..."
          className="md:col-span-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-label="Search insights"
        />
        <select
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-label="Filter insights by domain"
        >
          {domains.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Articles */}
      <div className="mt-12">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Featured Articles</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredInsights.map((insight) => (
            <Link key={insight.title} href={(insight.link || "/insights") as Route} className="group">
              <Card className="h-full transition-colors group-hover:border-primary">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    {insight.domain}
                  </Badge>
                  <CardTitle className="mt-2 text-lg">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <CardDescription className="text-sm text-muted-foreground">{insight.description}</CardDescription>
                  <span className="inline-flex items-center gap-1 text-sm text-primary">
                    Read article <ArrowUpRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {draftInsights.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Coming Soon</h2>
          <div className="space-y-3">
            {draftInsights.map((topic) => (
              <div
                key={topic.title}
                className="rounded-md border border-border bg-card/50 p-4 transition-colors hover:bg-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{topic.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{topic.domain}</p>
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap">
                    Draft
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
