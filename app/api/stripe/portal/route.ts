import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Geen email gevonden" }, { status: 400 });
    }

    // Zoek Stripe klant op via email
    const customers = await stripe.customers.search({
      query: `email:"${email}"`,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "Geen Stripe klant gevonden" }, { status: 404 });
    }

    const customerId = customers.data[0].id;

    const { origin } = new URL(req.url);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard/instellingen`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[STRIPE_PORTAL_ERROR]", error);
    return NextResponse.json({ error: "Portaal aanmaken mislukt", details: error.message }, { status: 500 });
  }
}
