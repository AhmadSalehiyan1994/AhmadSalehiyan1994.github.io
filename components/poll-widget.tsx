"use client";

import { useEffect, useMemo, useState } from "react";

type PollOption = {
  id: number;
  label: string;
  position: number;
};

type Poll = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  results_visibility: "public" | "after_vote" | "after_close";
  allow_multiple: boolean;
  max_choices: number | null;
  options: PollOption[];
  total_ballots: number;
  has_voted: number | null;
};

type PollResults = {
  id: number;
  label: string;
  votes: number;
  pct: number;
};

type PollWidgetProps = {
  title?: string;
  topic?: string;
  articleSlug?: string;
  scope?: "active" | "closed" | "featured";
  compact?: boolean;
  enableComments?: boolean;
};

type PollComment = {
  id: string;
  body: string;
  author_name: string;
  created_at: string;
};

function getCookieValue(name: string) {
  const token = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")?.[1];

  return token ?? "";
}

export function PollWidget({
  title = "Community Poll",
  topic,
  articleSlug,
  scope = "featured",
  compact = false,
  enableComments = true,
}: PollWidgetProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [results, setResults] = useState<PollResults[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "voting" | "error">("loading");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<PollComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  const hasVoted = useMemo(() => Boolean(poll?.has_voted), [poll?.has_voted]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("scope", scope);
    if (topic) params.set("topic", topic);
    if (articleSlug) params.set("articleSlug", articleSlug);

    async function loadPoll() {
      setStatus("loading");
      setMessage("");
      try {
        const response = await fetch(`/api/polls?${params.toString()}`);
        const payload = await response.json();

        if (!response.ok || !payload.ok) {
          throw new Error(payload?.error?.message || "Unable to load poll");
        }

        const firstPoll = payload.data?.[0] ?? null;
        setPoll(firstPoll);
        setStatus("idle");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to load poll");
      }
    }

    void loadPoll();
  }, [articleSlug, scope, topic]);

  useEffect(() => {
    if (!poll || (!hasVoted && poll.results_visibility !== "public")) {
      return;
    }

    const pollId = poll.id;

    async function loadResults() {
      const response = await fetch(`/api/polls/${pollId}/results`);
      const payload = await response.json();
      if (response.ok && payload.ok) {
        setResults(payload.data.results || []);
      }
    }

    void loadResults();
  }, [hasVoted, poll]);

  useEffect(() => {
    if (!poll || !enableComments) {
      return;
    }

    const pollId = poll.id;

    async function loadComments() {
      const response = await fetch(`/api/polls/${pollId}/comments`);
      const payload = await response.json();
      if (response.ok && payload.ok) {
        setComments(payload.data || []);
      }
    }

    void loadComments();
  }, [enableComments, poll]);

  async function submitVote() {
    if (!poll) {
      return;
    }

    if (selectedIds.length === 0) {
      setMessage("Please choose at least one option.");
      return;
    }

    setStatus("voting");
    setMessage("");

    try {
      const csrfToken = getCookieValue("csrf_token");

      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ optionIds: selectedIds }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setMessage(payload?.error?.message || "Vote failed.");
        setStatus("idle");
        return;
      }

      const nextPoll = { ...poll, has_voted: 1 };
      setPoll(nextPoll);
      setMessage("Vote submitted successfully.");
      setStatus("idle");

      const resultsResponse = await fetch(`/api/polls/${poll.id}/results`);
      const resultsPayload = await resultsResponse.json();
      if (resultsResponse.ok && resultsPayload.ok) {
        setResults(resultsPayload.data.results || []);
      }
    } catch {
      setMessage("Network issue while voting.");
      setStatus("idle");
    }
  }

  async function submitComment() {
    if (!poll) {
      return;
    }

    const text = commentText.trim();
    if (text.length < 5) {
      setCommentMessage("Comment is too short.");
      return;
    }

    const csrfToken = getCookieValue("csrf_token");
    const response = await fetch(`/api/polls/${poll.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ body: text }),
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      setCommentMessage(payload?.error?.message || "Unable to submit comment.");
      return;
    }

    setCommentText("");
    setCommentMessage("Comment submitted for moderation.");
  }

  async function followTopic() {
    if (!topic) {
      return;
    }

    const csrfToken = getCookieValue("csrf_token");
    const response = await fetch("/api/polls/topics/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ topicSlug: topic }),
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      setMessage(payload?.error?.message || "Unable to follow this topic.");
      return;
    }

    setMessage(`Now following ${topic} polls.`);
  }

  function toggleOption(optionId: number) {
    if (!poll || hasVoted) {
      return;
    }

    if (poll.allow_multiple) {
      setSelectedIds((prev) => {
        const exists = prev.includes(optionId);
        const next = exists ? prev.filter((item) => item !== optionId) : [...prev, optionId];

        if (poll.max_choices && next.length > poll.max_choices) {
          return prev;
        }

        return next;
      });
      return;
    }

    setSelectedIds([optionId]);
  }

  if (status === "loading") {
    return (
      <div className="rounded-lg border border-border/40 bg-card/50 p-4">
        <p className="text-sm text-muted-foreground">Loading poll...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
        <p className="text-sm text-red-300">{message || "Unable to load poll."}</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="rounded-lg border border-border/40 bg-card/50 p-4">
        <p className="text-sm text-muted-foreground">No active poll right now.</p>
      </div>
    );
  }

  return (
    <section className={`rounded-lg border border-border/40 bg-card/50 ${compact ? "p-4" : "p-6"}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{title}</p>
      <h3 className={`mt-2 font-semibold text-foreground ${compact ? "text-base" : "text-xl"}`}>{poll.title}</h3>
      {poll.description ? <p className="mt-2 text-sm text-muted-foreground">{poll.description}</p> : null}

      <div className="mt-4 space-y-2">
        {poll.options.map((option) => {
          const checked = selectedIds.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleOption(option.id)}
              disabled={hasVoted}
              className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                checked
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/50 bg-background/30 text-muted-foreground hover:border-primary/50"
              } ${hasVoted ? "cursor-default opacity-80" : ""}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {!hasVoted ? (
        <button
          type="button"
          onClick={submitVote}
          disabled={status === "voting"}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
        >
          {status === "voting" ? "Submitting..." : "Submit Vote"}
        </button>
      ) : null}

      {message ? <p className="mt-3 text-xs text-muted-foreground">{message}</p> : null}

      {results.length > 0 ? (
        <div className="mt-5 space-y-2 border-t border-border/40 pt-4">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Results</p>
          {results.map((result) => (
            <div key={result.id}>
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{result.label}</span>
                <span>{result.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${result.pct}%` }} />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Total voters: {poll.total_ballots}</p>
        </div>
      ) : null}

      {topic ? (
        <button
          type="button"
          onClick={followTopic}
          className="mt-4 inline-flex text-xs text-primary hover:underline"
        >
          Follow {topic} polls
        </button>
      ) : null}

      {enableComments ? (
        <div className="mt-6 border-t border-border/40 pt-4">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Comments</p>
          <div className="mt-3 space-y-2">
            {comments.slice(0, 5).map((comment) => (
              <div key={comment.id} className="rounded-md border border-border/40 bg-background/30 p-3">
                <p className="text-sm text-foreground">{comment.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{comment.author_name}</p>
              </div>
            ))}
            {comments.length === 0 ? <p className="text-xs text-muted-foreground">No approved comments yet.</p> : null}
          </div>
          <div className="mt-3 space-y-2">
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Share your reasoning (optional moderation before publish)."
            />
            <button
              type="button"
              onClick={submitComment}
              className="inline-flex rounded-md border border-primary/40 px-3 py-1.5 text-xs text-primary hover:bg-primary/10"
            >
              Submit comment
            </button>
            {commentMessage ? <p className="text-xs text-muted-foreground">{commentMessage}</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
