import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Voeg CLERK_WEBHOOK_SECRET toe aan je .env");
  }

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

  if (evt.type === "user.created") {
    const { id, first_name, last_name, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address || "";
    const fullName = `${first_name || ""} ${last_name || ""}`.trim();

    // 1. Sla op in database (Neon)
    try {
      await sql`
        INSERT INTO user_settings (clerk_id, full_name, language, units, plan_status, updated_at)
        VALUES (${id}, ${fullName}, 'Nederlands', 'kg', 'free', NOW())
        ON CONFLICT (clerk_id) DO NOTHING;
      `;
      console.log(`✅ Gebruiker ${id} succesvol opgeslagen in Neon.`);
    } catch (dbError) {
      console.error("❌ Database SQL Fout:", dbError);
      return new Response("Database opslag mislukt", { status: 500 });
    }

    // 2. Schiet door naar Resend & Trigger de Automation Flow via het Custom Event!
    if (email) {
      try {
        // Stap A: Contact aanmaken in Resend
        await resend.contacts.create({
          email: email,
          firstName: first_name || "Hondenbaasje",
          lastName: last_name || "",
          unsubscribed: false,
        });
        console.log(`✉️ Gebruiker ${email} succesvol aangemaakt in Resend.`);

        // Stap B: Het Custom Event afvuren om je 3-mail flow te starten
        await resend.events.send({
          event: "user.created", // Dit matcht met jouw ingevulde tekst in Resend
          email: email,
        });
        console.log(
          `🚀 Event 'user.created' verzonden naar Resend voor ${email}!`,
        );
      } catch (resendError) {
        console.error("❌ Fout bij Resend:", resendError);
      }
    }
  }

  return new Response("Webhook succesvol", { status: 200 });
}
