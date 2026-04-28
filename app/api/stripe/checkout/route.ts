import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialiseer Stripe (Zorg dat je STRIPE_SECRET_KEY in .env.local staat)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia", // Gebruik een stabiele API versie
});

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    // Haal parameters en de origin (basis URL) op uit het verzoek
    const { searchParams, origin } = new URL(req.url);
    const priceId = searchParams.get("priceId");

    // 1. Validatie: Is de gebruiker ingelogd?
    if (!userId || !user) {
      return new NextResponse("Niet geautoriseerd: Log eerst in.", {
        status: 401,
      });
    }

    // 2. Validatie: Is er een Price ID meegegeven?
    if (!priceId) {
      return new NextResponse("Fout: Geen priceId gevonden in de URL.", {
        status: 400,
      });
    }

    // 3. Maak de Stripe Checkout Sessie aan
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // De 'origin' zorgt ervoor dat de URL altijd compleet is (http://localhost:3000 of jouwdomein.nl)
      success_url: `${origin}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      allow_promotion_codes: true,
      metadata: {
        clerkUserId: userId,
      },
      customer_email: user.emailAddresses[0].emailAddress,
    });

    // 4. Controleer of de sessie een URL heeft en redirect de gebruiker
    if (!session.url) {
      return new NextResponse("Stripe kon geen checkout URL genereren.", {
        status: 500,
      });
    }

    // Belangrijk: Voor externe redirects in een GET route
    return NextResponse.redirect(session.url, 303);
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);

    // Geef een duidelijke foutmelding terug voor debugging
    return new NextResponse(
      JSON.stringify({
        error: "Interne server fout",
        details: error.message,
      }),
      { status: 500 },
    );
  }
}
