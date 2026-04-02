"use client";

import { useState } from "react";

type Mode = "login" | "register";

function getCookieValue(name: string) {
  return (
    document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${name}=`))
      ?.split("=")[1] || ""
  );
}

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      password: String(form.get("password") || ""),
    };

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      setMessage(result?.error?.message || "Authentication failed.");
      setBusy(false);
      return;
    }

    setMessage("Success. Refreshing...");
    window.location.reload();
  }

  async function logout() {
    const csrf = getCookieValue("csrf_token");
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "x-csrf-token": csrf },
    });
    window.location.reload();
  }

  return (
    <div className="rounded-lg border border-border bg-card/50 p-6">
      <div className="mb-4 flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-md px-3 py-1.5 ${mode === "login" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-md px-3 py-1.5 ${mode === "register" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Register
        </button>
        <button
          type="button"
          onClick={logout}
          className="ml-auto text-xs text-muted-foreground hover:text-foreground"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" ? (
          <input
            name="fullName"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Full name"
          />
        ) : null}

        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Password"
        />

        <button
          type="submit"
          disabled={busy}
          className="inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
        >
          {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>

        {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      </form>
    </div>
  );
}
