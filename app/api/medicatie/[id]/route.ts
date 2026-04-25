import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL!);

    // Wacht op de params (Next.js 15+ standaard)
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Ongeldig ID" }, { status: 400 });
    }

    // Verwijder alleen als het ID van de ingelogde gebruiker is
    const result = await sql`
      DELETE FROM medicatie 
      WHERE id = ${numericId} 
      AND user_id = ${userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    return NextResponse.json({ message: "Medicatie verwijderd" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Kon niet verwijderen" },
      { status: 500 },
    );
  }
}
