"use client";

import { useEffect, useState } from "react";

type ActivityData = {
  votes: { created_at: string; poll_title: string; poll_slug: string }[];
  badges: { awarded_at: string; slug: string; name: string; description: string; reason: string | null }[];
  notifications: { id: string; type: string; title: string; body: string; is_read: boolean; created_at: string }[];
};

function getCookieValue(name: string) {
  return (
    document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${name}=`))
      ?.split("=")[1] || ""
  );
}

export function MyPollActivity() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadActivity() {
      const response = await fetch("/api/polls/activity");
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setError(result?.error?.message || "Unable to load activity.");
        return;
      }

      setData(result.data);
    }

    void loadActivity();
  }, []);

  async function markRead(id: string) {
    const csrf = getCookieValue("csrf_token");
    await fetch(`/api/polls/notifications/${id}/read`, {
      method: "POST",
      headers: { "x-csrf-token": csrf },
    });
    setData((prev) =>
      prev
        ? {
            ...prev,
            notifications: prev.notifications.map((item) =>
              item.id === id ? { ...item, is_read: true } : item,
            ),
          }
        : prev,
    );
  }

  if (error) {
    return <p className="text-sm text-muted-foreground">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">Loading activity...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Recent Votes</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {data.votes.slice(0, 5).map((vote, idx) => (
            <li key={`${vote.poll_slug}-${idx}`}>• {vote.poll_title}</li>
          ))}
          {data.votes.length === 0 ? <li>No votes yet.</li> : null}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Badges</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {data.badges.map((badge) => (
            <li key={badge.slug}>🏅 {badge.name}</li>
          ))}
          {data.badges.length === 0 ? <li>No badges yet.</li> : null}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          {data.notifications.slice(0, 6).map((note) => (
            <li key={note.id} className="rounded-md border border-border/50 p-2">
              <p className="text-foreground">{note.title}</p>
              {note.body ? <p>{note.body}</p> : null}
              {!note.is_read ? (
                <button
                  type="button"
                  onClick={() => markRead(note.id)}
                  className="mt-1 text-xs text-primary hover:underline"
                >
                  Mark as read
                </button>
              ) : null}
            </li>
          ))}
          {data.notifications.length === 0 ? <li>No notifications yet.</li> : null}
        </ul>
      </div>
    </div>
  );
}
