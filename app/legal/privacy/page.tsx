import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy and data handling notice for this portfolio website.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Privacy Notice</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
        <p>This site is a personal portfolio. It does not intentionally collect sensitive personal data.</p>
        <p>If you contact via email or external platforms, your message is handled only for communication and collaboration.</p>
        <p>For data removal requests, email directly through the contact page.</p>
      </div>
    </section>
  );
}
