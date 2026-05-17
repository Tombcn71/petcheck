import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialiseer Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    // Haal parameters op
    const { searchParams, origin } = new URL(req.url);
    const rawPriceId = searchParams.get("priceId");

    // 1. Validatie: Is de gebruiker ingelogd?
    if (!userId || !user) {
      return new NextResponse("Niet geautoriseerd: Log eerst in.", {
        status: 401,
      });
    }

    // 2. Validatie & Vertaling: Zet "maand"/"jaar" om naar de ECHTE Stripe ID's
    if (!rawPriceId) {
      return new NextResponse("Fout: Geen priceId gevonden in de URL.", {
        status: 400,
      });
    }

    // Maak de string schoon (haalt eventuele enters/spaties weg)
    const cleanedPrice = rawPriceId.trim();

    let stripePriceId = "";
    if (cleanedPrice === "maand") {
      stripePriceId = "price_1QXXXXXXXXXXXXXX"; // <--- VUL HIER JE ECHTE STRIPE PRICE ID IN VOOR MAANDELIJKS
    } else if (cleanedPrice === "jaar") {
      stripePriceId = "price_1QXXXXXXXXXXXXXX"; // <--- VUL HIER JE ECHTE STRIPE PRICE ID IN VOOR JAARLIJKS
    } else {
      // Als er al een echte 'price_...' string werd meegestuurd, gebruik die dan
      stripePriceId = cleanedPrice;
    }

    // Extra check of we nu een Stripe ID hebben
    if (
      !stripePriceId ||
      stripePriceId === "maand" ||
      stripePriceId === "jaar"
    ) {
      return new NextResponse(
        `Fout: Geen geldige Stripe Price ID gekoppeld aan '${cleanedPrice}'. Vul deze in je backend route.ts in!`,
        { status: 400 },
      );
    }

    // 3. Maak de Stripe Checkout Sessie aan met de ECHTE stripePriceId
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: stripePriceId, // <--- Nu sturen we de echte 'price_...' naar Stripe!
          quantity: 1,
        },
      ],
      locale: "nl",
      mode: "subscription",
      success_url: `${origin}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      allow_promotion_codes: true,
      metadata: {
        clerkUserId: userId,
      },
      customer_email: user.emailAddresses[0].emailAddress,
    });

    if (!session.url) {
      return new NextResponse("Stripe kon geen checkout URL genereren.", {
        status: 500,
      });
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);

    return new NextResponse(
      JSON.stringify({
        error: "Interne server fout",
        details: error.message,
      }),
      { status: 500 },
    );
  }
}
