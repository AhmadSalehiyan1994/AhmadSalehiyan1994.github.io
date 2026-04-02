import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae download page.",
  alternates: {
    canonical: "/cv",
  },
  openGraph: {
    title: "CV | Ahmad Salehiyan",
    description: "Download the latest curriculum vitae.",
    url: "/cv",
    images: [
      {
        url: "/images/first.png",
        width: 1200,
        height: 630,
        alt: "Curriculum Vitae",
      },
    ],
  },
};

export default function CvPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">CV</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Curriculum Vitae</h1>
      <p className="mt-4 text-muted-foreground">Use the existing CV asset from the legacy repository until a refreshed version is published.</p>
      <div className="mt-8">
        <a
          href="/cv_file/CV.pdf"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Download CV PDF
        </a>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">If your CV file name differs, update the link in `app/cv/page.tsx`.</p>
    </section>
  );
}
