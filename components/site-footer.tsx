import Link from "next/link";
import { siteContent } from "@/lib/content";
import { getCurrentLanguage, getDictionary } from "@/lib/i18n";

export function SiteFooter() {
  const lang = getCurrentLanguage();
  const dict = getDictionary(lang);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {siteContent.person.name}. {dict.footer.rights}</p>
        <div className="flex items-center gap-4">
          <a href={siteContent.person.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">
            LinkedIn
          </a>
          <a href={siteContent.person.github} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <Link href="/legal/privacy" className="hover:text-foreground">
            {dict.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
