import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const dogId = searchParams.get("dogId");

    if (!userId) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    let scans;

    // De dog_id wordt als string vergeleken (geen parseInt nodig voor UUID's)
    if (dogId && dogId !== "undefined" && dogId !== "") {
      scans = await sql`
        SELECT * FROM scans 
        WHERE user_id = ${userId} AND dog_id = ${dogId} 
        ORDER BY created_at DESC
      `;
    } else {
      // Fallback: pak scans van de allereerste hond van deze user
      scans = await sql`
        SELECT * FROM scans 
        WHERE user_id = ${userId} 
        AND dog_id = (SELECT id FROM dogs WHERE user_id = ${userId} LIMIT 1)
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json(scans);
  } catch (error) {
    console.error("API Error scans:", error);
    return NextResponse.json({ error: "Fout bij ophalen" }, { status: 500 });
  }
}
