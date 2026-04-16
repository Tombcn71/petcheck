import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function DELETE(
  request: Request,
  // FIX: params moet hier gedefinieerd worden als een Promise
  context: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Await de params van de context
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Geen ID opgegeven" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // 2. Voer de delete uit
    const result = await sql`
      DELETE FROM scans 
      WHERE id = ${id} 
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Item niet gevonden in database" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Item succesvol verwijderd" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Verwijderen mislukt" }, { status: 500 });
  }
}
