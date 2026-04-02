import Link from "next/link";

export function StickyContactCta() {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        Book a Call
      </Link>
    </div>
  );
}
