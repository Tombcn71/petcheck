import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

// Initialiseer Resend met je API key uit je .env
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 2. Maak de gebruiker aan in Neon (Aangepast aan jouw exacte kolommen)
    try {
      await sql`
        INSERT INTO user_settings (clerk_id, full_name, language, units, plan_status, updated_at)
        VALUES (${id}, ${fullName}, 'Nederlands', 'kg', 'free', NOW())
        ON CONFLICT (clerk_id) DO NOTHING;
      `;
      console.log(
        `✅ Gebruiker ${id} succesvol opgeslagen in Neon met plan_status 'free'`,
      );
    } catch (dbError) {
      console.error("❌ Database SQL Fout bij opslaan gebruiker:", dbError);
      // We returnen een 500 als de database weigert, zodat Clerk weet dat het mislukt is
      return new Response("Database opslag mislukt", { status: 500 });
    }

    // 3. Schiet de gebruiker direct door naar Resend All Contacts!
    if (email) {
      try {
        await resend.contacts.create({
          email: email,
          firstName: first_name || "Hondenbaasje",
          lastName: last_name || "",
          unsubscribed: false,
          // Let op: als Resend om een audienceId vraagt, voeg die dan hieronder toe:
          // audienceId: process.env.RESEND_AUDIENCE_ID!,
        });
        console.log(`✉️ Gebruiker ${email} succesvol toegevoegd aan Resend`);
      } catch (resendError) {
        // We loggen de fout, maar laten de webhook niet crashen als Resend even tegenstribbelt
        console.error("❌ Fout bij toevoegen aan Resend:", resendError);
      }
    }
  }

  return new Response("Webhook succesvol", { status: 200 });
}
