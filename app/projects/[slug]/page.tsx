import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProjectBySlug, siteContent } from "@/lib/content";

type ProjectDetailPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return siteContent.projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: ProjectDetailPageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    return { title: "Project Not Found" };
  }

  const canonicalPath = `/projects/${project.slug}`;

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${project.title} | Project Case`,
      description: project.description,
      url: canonicalPath,
      images: [
        {
          url: "/images/first.png",
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Project Case`,
      description: project.description,
      images: ["/images/first.png"],
    },
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Projects
      </Link>
      <div className="mt-6">
        <Badge variant="outline">{project.domain}</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{project.title}</h1>
        <p className="mt-4 text-muted-foreground">{project.description}</p>
      </div>
      <Separator className="my-8" />
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Problem</h2>
          <p className="mt-2 text-muted-foreground">{project.problem}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Role</h2>
          <p className="mt-2 text-muted-foreground">{project.role}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Outcome</h2>
          <p className="mt-2 text-muted-foreground">{project.outcome}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Stack</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        </div>
        {project.links && project.links.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Links</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-primary hover:underline">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
