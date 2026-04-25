import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // We definiëren params nu als een Promise
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const sql = neon(process.env.DATABASE_URL!);

    // FIX 1: Wacht op de params (Unwrap the Promise)
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Controleer of id een geldig nummer is
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Ongeldig ID" }, { status: 400 });
    }

    // FIX 2: Voer de DELETE uit
    const result = await sql`
      DELETE FROM vaccinaties 
      WHERE id = ${numericId} 
      AND user_id = ${userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Item niet gevonden of niet gemachtigd" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Verwijderd" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Kon niet verwijderen" },
      { status: 500 },
    );
  }
}
