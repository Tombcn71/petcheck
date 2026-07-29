import { createHash } from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_CONVERSIONS_API_TOKEN;

function hashEmail(email: string) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export async function sendCapiEvent(params: {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  customData?: Record<string, unknown>;
}) {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const userData: Record<string, unknown> = {};
  if (params.email) userData.em = [hashEmail(params.email)];
  if (params.ip) userData.client_ip_address = params.ip;
  if (params.userAgent) userData.client_user_agent = params.userAgent;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: params.eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: params.eventId,
              event_source_url: params.eventSourceUrl,
              action_source: "website",
              user_data: userData,
              custom_data: params.customData,
            },
          ],
        }),
      },
    );
    if (!res.ok) {
      console.error("Meta CAPI fout:", await res.text());
    }
  } catch (err) {
    console.error("Meta CAPI request mislukt:", err);
  }
}
