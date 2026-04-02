import type { Metadata } from "next";
import { ProjectList } from "@/components/project-list";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case overviews focused on maintenance, optimization, and machine learning work.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Ahmad Salehiyan",
    description: "Case overviews focused on maintenance, optimization, and machine learning work.",
    url: "/projects",
    images: [
      {
        url: "/images/first.png",
        width: 1200,
        height: 630,
        alt: "Selected projects",
      },
    ],
  },
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Projects</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Selected case overviews</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        A focused set of projects where modeling, data structuring, and analytics support clearer operational decisions.
      </p>
      <div className="mt-8">
        <ProjectList />
      </div>
    </section>
  );
}
