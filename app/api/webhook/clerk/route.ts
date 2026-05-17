import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Voeg CLERK_WEBHOOK_SECRET toe aan je .env");
  }

  // Header verificatie (Svix)
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Geen svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Verificatie mislukt", { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  // Logica voor nieuwe gebruiker
  if (evt.type === "user.created") {
    const { id, first_name, last_name, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address || "";
    const fullName = `${first_name || ""} ${last_name || ""}`.trim();

    // Maak de gebruiker aan in Neon en zet de plan_status expliciet op 'free' of 'trial'
    await sql`
      INSERT INTO user_settings (clerk_id, full_name, language, units, plan_status, created_at, updated_at)
      VALUES (${id}, ${fullName}, 'Nederlands', 'kg', 'free', NOW(), NOW())
      ON CONFLICT (clerk_id) DO NOTHING;
    `;

    console.log(
      `✅ Gebruiker ${id} succesvol opgeslagen in Neon met plan_status 'free'`,
    );
  }

  return new Response("Webhook succesvol", { status: 200 });
}
