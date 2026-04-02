"use client";

import { useMemo, useState } from "react";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  const formStartedAt = useMemo(() => Date.now(), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      formStartedAt: Number(formData.get("formStartedAt") || formStartedAt),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setStatus("error");
        setMessage(result.message || "Unable to submit the form.");
        return;
      }

      form.reset();
      setStatus("success");
      setMessage(result.message || "Message sent successfully.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-muted-foreground">
          Name
          <input
            name="name"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary/60"
            placeholder="Your full name"
          />
        </label>
        <label className="space-y-2 text-sm text-muted-foreground">
          Email
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary/60"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-muted-foreground">
        Subject
        <input
          name="subject"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary/60"
          placeholder="Project type or challenge"
        />
      </label>

      <label className="space-y-2 text-sm text-muted-foreground">
        Message
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary/60"
          placeholder="Share your current challenge, constraints, and expected outcomes."
        />
      </label>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <input type="hidden" name="formStartedAt" value={formStartedAt} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {message ? (
        <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>{message}</p>
      ) : null}
    </form>
  );
}
