import { siteContent } from "@/lib/content";
import { Separator } from "@/components/ui/separator";

export function ExperienceSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Experience</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Professional journey</h2>
      
      <div className="mt-8 space-y-6">
        {siteContent.experience.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card/50 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.role}</h3>
                <p className="text-sm text-primary">{item.organization}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.period}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-6">{item.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
