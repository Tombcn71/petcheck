import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // We halen alle kolommen op uit de tabel 'scans'
    const data = await sql`SELECT * FROM scans ORDER BY created_at DESC`;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Neon Error:", error);
    return NextResponse.json(
      { error: "Database verbinding mislukt" },
      { status: 500 },
    );
  }
}
