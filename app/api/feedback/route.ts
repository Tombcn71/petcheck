import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

async function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      user_email TEXT,
      categorie TEXT,
      bericht TEXT NOT NULL,
      mag_reageren BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS mag_reageren BOOLEAN DEFAULT FALSE`;
  return sql;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;

  const { categorie, bericht, magReageren } = await req.json();
  if (!bericht?.trim()) return NextResponse.json({ error: "Bericht is leeg" }, { status: 400 });

  const sql = await getDb();
  await sql`
    INSERT INTO feedback (user_id, user_email, categorie, bericht, mag_reageren)
    VALUES (${userId}, ${email}, ${categorie}, ${bericht}, ${!!magReageren})
  `;

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pw = searchParams.get("pw");
  if (!pw || pw !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const sql = await getDb();
  const rows = await sql`SELECT * FROM feedback ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}
