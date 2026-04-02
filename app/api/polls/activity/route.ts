import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { parsePagination } from "@/lib/pagination";

export async function GET(request: Request) {
  const session = await getVerifiedMemberSession();

  if (!session.memberId) {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "AUTH_REQUIRED", message: "Please sign in to view activity." },
      },
      { status: 401 },
    );
  }

  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const { page, pageSize, offset } = parsePagination(searchParams, { pageSize: 20, maxPageSize: 100 });
    const votesPagination = parsePagination(
      new URLSearchParams({ page: searchParams.get("votesPage") ?? "1", pageSize: searchParams.get("votesPageSize") ?? "20" }),
      { pageSize: 20, maxPageSize: 100 },
    );
    const badgesPagination = parsePagination(
      new URLSearchParams({ page: searchParams.get("badgesPage") ?? "1", pageSize: searchParams.get("badgesPageSize") ?? "20" }),
      { pageSize: 20, maxPageSize: 100 },
    );

    const [votes, badges, notifications, notificationsCount, votesCount, badgesCount] = await Promise.all([
      db.query(
        `
          select
            b.created_at,
            p.title as poll_title,
            p.slug as poll_slug
          from poll_ballots b
          join polls p on p.id = b.poll_id
          where b.member_id = $1
          order by b.created_at desc
          limit $2
          offset $3;
        `,
        [session.memberId, votesPagination.pageSize, votesPagination.offset],
      ),
      db.query(
        `
          select
            mb.awarded_at,
            pb.slug,
            pb.name,
            pb.description,
            mb.reason
          from member_badges mb
          join poll_badges pb on pb.id = mb.badge_id
          where mb.member_id = $1
          order by mb.awarded_at desc
          limit $2
          offset $3;
        `,
        [session.memberId, badgesPagination.pageSize, badgesPagination.offset],
      ),
      db.query(
        `
          select id, type, title, body, metadata, is_read, created_at
          from poll_notifications
          where member_id = $1
          order by created_at desc
          limit $2
          offset $3;
        `,
        [session.memberId, pageSize, offset],
      ),
      db.query(
        `
          select count(*)::int as total
          from poll_notifications
          where member_id = $1;
        `,
        [session.memberId],
      ),
      db.query(
        `
          select count(*)::int as total
          from poll_ballots
          where member_id = $1;
        `,
        [session.memberId],
      ),
      db.query(
        `
          select count(*)::int as total
          from member_badges
          where member_id = $1;
        `,
        [session.memberId],
      ),
    ]);

    const total = Number(notificationsCount.rows[0]?.total ?? 0);
    const votesTotal = Number(votesCount.rows[0]?.total ?? 0);
    const badgesTotal = Number(badgesCount.rows[0]?.total ?? 0);

    return NextResponse.json({
      ok: true,
      data: {
        votes: votes.rows,
        badges: badges.rows,
        notifications: notifications.rows,
      },
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
      votesPagination: {
        page: votesPagination.page,
        pageSize: votesPagination.pageSize,
        total: votesTotal,
        totalPages: Math.max(Math.ceil(votesTotal / votesPagination.pageSize), 1),
      },
      badgesPagination: {
        page: badgesPagination.page,
        pageSize: badgesPagination.pageSize,
        total: badgesTotal,
        totalPages: Math.max(Math.ceil(badgesTotal / badgesPagination.pageSize), 1),
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "ACTIVITY_FETCH_FAILED", message: "Unable to load member activity." },
      },
      { status: 500 },
    );
  }
}
