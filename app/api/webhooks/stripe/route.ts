import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless"; // Importeer de Neon client
import { sendCapiEvent } from "@/lib/metaCapi";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  const sql = neon(process.env.DATABASE_URL!); // Connectie met Neon

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.metadata?.clerkUserId;
    const stripeCustomerId = session.customer as string;

    if (!clerkUserId) {
      console.error("❌ Geen clerkUserId gevonden in metadata");
      return new NextResponse("Geen user ID", { status: 400 });
    }

    try {
      // --- STAP 1: CLERK METADATA UPDATEN ---
      await clerkClient.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          role: "pro",
        },
      });

      // --- STAP 2: NEON DATABASE UPDATEN (DIRECT SQL) ---
      // We gebruiken de kolomnamen die we uit jouw SQL Editor hebben gehaald
      await sql`
        UPDATE user_settings 
        SET 
          plan_status = 'pro', 
          stripe_customer_id = ${stripeCustomerId},
          updated_at = NOW()
        WHERE clerk_id = ${clerkUserId}
      `;

      console.log(
        `✅ Business sync compleet: Clerk & Neon geüpdatet voor ${clerkUserId}`,
      );

      // --- STAP 3: PURCHASE NAAR META CONVERSIONS API ---
      sendCapiEvent({
        eventName: "Purchase",
        eventId: session.id,
        eventSourceUrl: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
          : "https://www.doggyscan.nl/dashboard",
        email: session.customer_details?.email || session.customer_email || undefined,
        customData: {
          value: (session.amount_total ?? 0) / 100,
          currency: session.currency?.toUpperCase() || "EUR",
        },
      }).catch(() => {});
    } catch (error) {
      console.error("❌ Database of Clerk update gefaald:", error);
      return new NextResponse("Sync fout", { status: 500 });
    }
  }

  return new NextResponse("Webhook succesvol verwerkt", { status: 200 });
}
