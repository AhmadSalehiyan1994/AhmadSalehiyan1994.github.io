import { siteContent } from "@/lib/content";
import { Separator } from "@/components/ui/separator";

export function CredentialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
      <div className="rounded-lg border border-border bg-card p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Credentials</p>
        <div className="mt-6 grid gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Education</h3>
            <div className="mt-4 space-y-6">
              {siteContent.education.map((item, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-4">
                  <p className="font-semibold text-foreground">{item.degree}</p>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-sm text-primary font-medium hover:underline">
                      {item.institution}
                    </a>
                  ) : (
                    <p className="text-sm text-primary font-medium">{item.institution}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{item.period}</p>
                  {item.focus && (
                    <p className="mt-2 text-sm text-muted-foreground italic">{item.focus}</p>
                  )}
                  {item.advisor && (
                    <p className="mt-1 text-xs text-muted-foreground">Advisor: {item.advisor}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold text-foreground">Certifications</h3>
            <div className="mt-4 space-y-2">
              {siteContent.certifications.map((item) => (
                <p key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
