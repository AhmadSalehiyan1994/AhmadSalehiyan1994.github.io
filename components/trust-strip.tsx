import { siteContent } from "@/lib/content";

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 py-10 md:grid-cols-3">
          {siteContent.trustStrip.map((item, idx) => (
            <div key={idx} className="space-y-2 border-l border-border pl-4 md:border-l md:pl-4">
              <p className="text-sm font-medium text-foreground">{item.split(" — ")[0]}</p>
              {item.includes(" — ") && (
                <p className="text-xs text-muted-foreground">{item.split(" — ")[1]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
