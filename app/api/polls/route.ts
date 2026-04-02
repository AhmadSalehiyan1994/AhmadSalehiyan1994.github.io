import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { parsePagination } from "@/lib/pagination";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const articleSlug = searchParams.get("articleSlug");
    const scope = searchParams.get("scope") ?? "active";
    const { page, pageSize, offset } = parsePagination(searchParams, { pageSize: 20, maxPageSize: 100 });

    const session = await getVerifiedMemberSession();

    const values: Array<string | number> = [];
    const conditions: string[] = [];

    if (scope === "active") {
      conditions.push("p.status = 'active'");
    } else if (scope === "closed") {
      conditions.push("p.status = 'closed'");
    } else if (scope === "featured") {
      conditions.push("p.status = 'active'");
      conditions.push("p.is_featured = true");
    }

    if (topic) {
      values.push(topic);
      conditions.push(`exists (
        select 1 from poll_topics pt
        where pt.poll_id = p.id and pt.topic_slug = $${values.length}
      )`);
    }

    if (articleSlug) {
      values.push(articleSlug);
      conditions.push(`exists (
        select 1 from poll_targets tgt
        where tgt.poll_id = p.id and tgt.target_type = 'article' and tgt.target_key = $${values.length}
      )`);
    }

    const whereClause = conditions.length > 0 ? `where ${conditions.join(" and ")}` : "";

    const query = `
      select
        p.id,
        p.slug,
        p.title,
        p.description,
        p.status,
        p.visibility,
        p.results_visibility,
        p.allow_multiple,
        p.max_choices,
        p.starts_at,
        p.ends_at,
        p.is_featured,
        coalesce(
          json_agg(
            json_build_object(
              'id', o.id,
              'label', o.label,
              'position', o.position
            ) order by o.position
          ) filter (where o.id is not null),
          '[]'::json
        ) as options,
        (
          select count(*)::int from poll_ballots b where b.poll_id = p.id
        ) as total_ballots,
        (
          select 1 from poll_ballots b where b.poll_id = p.id and b.member_id = $${values.length + 1}
        ) as has_voted
      from polls p
      left join poll_options o on o.poll_id = p.id
      ${whereClause}
      group by p.id
      order by p.is_featured desc, p.starts_at desc nulls last, p.created_at desc
      limit $${values.length + 2}
      offset $${values.length + 3};
    `;

    const memberId = session.memberId ?? "00000000-0000-0000-0000-000000000000";
    const countQuery = `
      select count(*)::int as total
      from polls p
      ${whereClause};
    `;

    const [{ rows }, countResult] = await Promise.all([
      db.query(query, [...values, memberId, pageSize, offset]),
      db.query(countQuery, values),
    ]);

    const total = Number(countResult.rows[0]?.total ?? 0);

    return NextResponse.json({
      ok: true,
      data: rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "POLL_LIST_ERROR",
          message: "Unable to fetch polls.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}
