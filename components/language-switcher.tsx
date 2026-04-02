"use client";

export function LanguageSwitcher() {
  function switchLang(lang: "en" | "fa") {
    document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2" aria-label="Language switcher">
      <button
        type="button"
        onClick={() => switchLang("en")}
        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLang("fa")}
        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      >
        FA
      </button>
    </div>
  );
}
