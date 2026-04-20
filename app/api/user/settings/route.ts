import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

// 1. DATA OPHALEN UIT NEON
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Niet ingelogd", { status: 401 });

    const sql = neon(process.env.DATABASE_URL!);

    const data = await sql`
      SELECT full_name, notifications 
      FROM user_settings 
      WHERE clerk_id = ${userId} 
      LIMIT 1
    `;

    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error("GET Error:", error);
    return new NextResponse("Fout bij ophalen", { status: 500 });
  }
}

// 2. DATA OPSLAAN/BIJWERKEN IN NEON
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Niet ingelogd", { status: 401 });

    const { name, notifications } = await req.json();
    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      INSERT INTO user_settings (clerk_id, full_name, notifications, units)
      VALUES (${userId}, ${name}, ${notifications}, 'kg')
      ON CONFLICT (clerk_id) 
      DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        notifications = EXCLUDED.notifications,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json({ message: "Succes" });
  } catch (error) {
    console.error("PATCH Error:", error);
    return new NextResponse("Fout bij opslaan", { status: 500 });
  }
}
