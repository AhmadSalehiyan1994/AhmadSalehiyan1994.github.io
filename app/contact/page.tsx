import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/lib/content";
import { ContactForm } from "@/components/contact-form";
import { SeoJsonLd } from "@/components/seo-json-ld";

const canonicalPath = "/contact";

const faqItems = [
  {
    question: "What types of projects do you take on?",
    answer:
      "I focus on reliability engineering, maintenance analytics, optimization modeling, and machine learning applications for operations.",
  },
  {
    question: "What information should I send in the first message?",
    answer:
      "Share your current process, constraints, data availability, and what decision you want to improve. That helps me scope quickly.",
  },
  {
    question: "Do you support short advisory engagements?",
    answer:
      "Yes. I offer short diagnostics, model reviews, and implementation plans in addition to full project collaboration.",
  },
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for collaborations in analytics, optimization, and reliability engineering.",
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    title: "Contact | Ahmad Salehiyan",
    description: "Get in touch for collaborations in analytics, optimization, and reliability engineering.",
    url: canonicalPath,
    images: [
      {
        url: "/images/first.png",
        width: 1200,
        height: 630,
        alt: "Contact Ahmad Salehiyan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Ahmad Salehiyan",
    description: "Get in touch for collaborations in analytics, optimization, and reliability engineering.",
    images: ["/images/first.png"],
  },
};

export default function ContactPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <SeoJsonLd data={faqSchema} />
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Contact</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Let’s discuss your operational challenge</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Share context, constraints, and goals. I can help scope practical analytics and optimization approaches.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card/60 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Service Package</p>
          <p className="mt-2 font-medium text-foreground">Maintenance Analytics Setup</p>
          <p className="mt-1 text-sm text-muted-foreground">KPI design, reporting logic, and decision-oriented dashboards.</p>
        </div>
        <div className="rounded-lg border border-border bg-card/60 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Service Package</p>
          <p className="mt-2 font-medium text-foreground">Optimization Model Sprint</p>
          <p className="mt-1 text-sm text-muted-foreground">Build and validate integer/decomposition models for planning.</p>
        </div>
        <div className="rounded-lg border border-border bg-card/60 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Service Package</p>
          <p className="mt-2 font-medium text-foreground">Predictive Reliability Pilot</p>
          <p className="mt-1 text-sm text-muted-foreground">Design a practical ML pilot for failure prediction and actioning.</p>
        </div>
      </div>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Email</p>
        <Link href={`mailto:${siteContent.person.email}`} className="mt-1 inline-block text-lg text-foreground hover:underline">
          {siteContent.person.email}
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">
          Prefer async? Send your context and I’ll reply with a practical next-step plan.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a href={siteContent.person.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            LinkedIn
          </a>
          <a href={siteContent.person.github} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            GitHub
          </a>
          <a href="/files/one-page-profile.md" download className="text-primary hover:underline">
            Download one-page profile
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card/50 p-6">
        <h2 className="text-xl font-semibold text-foreground">How to start</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>1. Share your objective and constraints.</li>
          <li>2. I review data/process fit and propose a scope.</li>
          <li>3. We align on timeline, deliverables, and kickoff.</li>
        </ol>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card/50 p-6">
        <h2 className="text-xl font-semibold text-foreground">FAQ</h2>
        <div className="mt-4 space-y-4">
          {faqItems.map((item) => (
            <div key={item.question}>
              <h3 className="font-medium text-foreground">{item.question}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
