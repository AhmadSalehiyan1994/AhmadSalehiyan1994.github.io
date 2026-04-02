"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteContent } from "@/lib/content";

export function ProjectList() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");

  const domains = useMemo(
    () => ["All", ...new Set(siteContent.projects.map((project) => project.domain))],
    [],
  );

  const filteredProjects = useMemo(
    () =>
      siteContent.projects.filter((project) => {
        const matchesQuery =
          project.title.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase()) ||
          project.stack.join(" ").toLowerCase().includes(query.toLowerCase());

        const matchesDomain = domain === "All" || project.domain === domain;

        return matchesQuery && matchesDomain;
      }),
    [domain, query],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects..."
          className="md:col-span-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-label="Search projects"
        />
        <select
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-label="Filter projects by domain"
        >
          {domains.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredProjects.map((project) => (
        <Card key={project.slug} className="h-full">
          <CardHeader>
            <Badge variant="outline" className="w-fit">{project.domain}</Badge>
            <CardTitle className="mt-2">{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/projects/${project.slug}` as Route} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              Read case overview <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
  );
}
