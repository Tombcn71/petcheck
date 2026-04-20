import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27", // Gebruik de nieuwste versie
});

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // In een echte app haal je het stripe_customer_id op uit je database
  // Voor nu simuleren we de redirect naar de portal
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: "cus_xxxxxxx", // Haal dit ID op uit je database gekoppeld aan de userId
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/instellingen`,
  });

  return NextResponse.json({ url: portalSession.url });
}
