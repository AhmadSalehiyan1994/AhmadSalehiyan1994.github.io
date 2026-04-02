import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you’re looking for is unavailable or moved.</p>
      <Link href="/" className="mt-6 inline-block text-primary hover:underline">
        Return home
      </Link>
    </section>
  );
}
