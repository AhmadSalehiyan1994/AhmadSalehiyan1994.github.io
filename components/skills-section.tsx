import { Badge } from "@/components/ui/badge";
import { siteContent } from "@/lib/content";

export function SkillsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Skills & Expertise</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Technical toolkit and methodologies</h2>
      
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Programming & Languages</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {siteContent.skills.languages.map((item) => (
              <Badge key={item} variant="outline">{item}</Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Methods & Approaches</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {siteContent.skills.methods.map((item) => (
              <Badge key={item} variant="outline">{item}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Tools & Platforms</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {siteContent.skills.tools.map((item) => (
              <Badge key={item} variant="outline">{item}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Specializations</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {siteContent.skills.specializations.map((item) => (
              <Badge key={item} variant="outline">{item}</Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
