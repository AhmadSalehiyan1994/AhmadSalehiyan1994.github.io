"use client";

import { useEffect, useState } from "react";

type PendingComment = {
  id: string;
  body: string;
  poll_title: string;
  member_name: string;
  created_at: string;
};

function getCookieValue(name: string) {
  return (
    document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${name}=`))
      ?.split("=")[1] || ""
  );
}

export function AdminPollsPanel() {
  const [message, setMessage] = useState("");
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);

  useEffect(() => {
    async function loadPending() {
      const response = await fetch("/api/polls/comments/pending");
      const result = await response.json();
      if (response.ok && result.ok) {
        setPendingComments(result.data || []);
      }
    }

    void loadPending();
  }, []);

  async function createPoll(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const options = String(form.get("options") || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((label) => ({ label }));

    const csrf = getCookieValue("csrf_token");

    const payload = {
      slug: String(form.get("slug") || "").trim(),
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim(),
      allowMultiple: Boolean(form.get("allowMultiple")),
      maxChoices: Number(form.get("maxChoices") || 1),
      status: String(form.get("status") || "draft"),
      isFeatured: Boolean(form.get("isFeatured")),
      options,
      topics: String(form.get("topics") || "")
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/polls/admin/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrf,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      setMessage(result?.error?.message || "Failed to create poll.");
      return;
    }

    setMessage("Poll created successfully.");
    event.currentTarget.reset();
  }

  async function moderate(commentId: string, action: "approve" | "reject" | "hide") {
    const csrf = getCookieValue("csrf_token");
    const response = await fetch(`/api/polls/comments/${commentId}/moderate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrf,
      },
      body: JSON.stringify({ action }),
    });

    const result = await response.json();
    if (response.ok && result.ok) {
      setPendingComments((prev) => prev.filter((comment) => comment.id !== commentId));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={createPoll} className="rounded-lg border border-border bg-card/50 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Create Poll</h2>
        <input name="slug" required placeholder="slug" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <input name="title" required placeholder="Title" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <textarea name="description" placeholder="Description" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <textarea name="options" required placeholder="One option per line" rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <input name="topics" placeholder="machine-learning, optimization" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" name="allowMultiple" /> Allow multiple</label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" name="isFeatured" /> Featured</label>
        <input name="maxChoices" type="number" min={1} defaultValue={1} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <select name="status" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
        </select>
        <button type="submit" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Create Poll</button>
        {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      </form>

      <div className="rounded-lg border border-border bg-card/50 p-6">
        <h2 className="text-lg font-semibold text-foreground">Pending Comments</h2>
        <div className="mt-4 space-y-3">
          {pendingComments.map((comment) => (
            <div key={comment.id} className="rounded-md border border-border/50 p-3">
              <p className="text-sm text-foreground">{comment.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">{comment.member_name} · {comment.poll_title}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={() => moderate(comment.id, "approve")} className="text-xs text-emerald-400 hover:underline">Approve</button>
                <button type="button" onClick={() => moderate(comment.id, "reject")} className="text-xs text-red-400 hover:underline">Reject</button>
                <button type="button" onClick={() => moderate(comment.id, "hide")} className="text-xs text-muted-foreground hover:underline">Hide</button>
              </div>
            </div>
          ))}
          {pendingComments.length === 0 ? <p className="text-sm text-muted-foreground">No pending comments.</p> : null}
        </div>
      </div>
    </div>
  );
}
