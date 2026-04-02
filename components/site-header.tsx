import Link from "next/link";
import Image from "next/image";
import { getCurrentLanguage, getDictionary } from "@/lib/i18n";

export function SiteHeader() {
  const lang = getCurrentLanguage();
  const dict = getDictionary(lang);

  const navItems = [
    { label: dict.nav.projects, href: "/projects" },
    { label: dict.nav.blog, href: "/insights" },
    { label: dict.nav.contact, href: "/contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="inline-flex items-center gap-2.5 text-foreground">
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#030817] shadow-sm">
            <span className="absolute inset-0 rounded-full border border-[#1e40af]/90" />
            <span className="absolute inset-[2px] rounded-full border border-[#3b82f6]" />
            <span className="relative h-[28px] w-[28px] overflow-hidden rounded-full border border-[#93c5fd]/55">
              <Image
                src="/images/first.png"
                alt="Portfolio logo"
                width={28}
                height={28}
                className="h-full w-full object-cover object-[center_22%]"
                priority
              />
            </span>
          </span>
          <span className="leading-tight">
            <span className="block text-[19px] font-semibold tracking-tight">Ahmad Salehiyan</span>
            <span className="block text-[12px] font-medium text-muted-foreground">Industrial Engineer</span>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
