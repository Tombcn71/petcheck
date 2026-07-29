import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { sendCapiEvent } from "@/lib/metaCapi";

const TOEGESTANE_EVENTS = new Set(["Lead", "InitiateCheckout"]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, eventId, value, currency } = body;

    if (!TOEGESTANE_EVENTS.has(eventName) || !eventId) {
      return NextResponse.json({ error: "Ongeldige event" }, { status: 400 });
    }

    const user = await currentUser().catch(() => null);
    const origin = req.headers.get("origin") || "https://www.doggyscan.nl";

    const result = await sendCapiEvent({
      eventName,
      eventId,
      eventSourceUrl: origin,
      email: user?.emailAddresses[0]?.emailAddress,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: req.headers.get("user-agent") || undefined,
      customData: value ? { value, currency: currency || "EUR" } : undefined,
    });

    return NextResponse.json({ success: true, meta: result });
  } catch (err) {
    return NextResponse.json(
      { error: "Tracking mislukt", detail: String(err) },
      { status: 500 },
    );
  }
}
