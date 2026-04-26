"use server";

import webpush from "web-push";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

webpush.setVapidDetails(
  "mailto:info@doggyscan.nl",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function subscribeUser(sub: any) {
  try {
    // Sla op in Neon met een upsert op endpoint
    await sql`
      INSERT INTO push_subscriptions (endpoint, p256dh, auth)
      VALUES (${sub.endpoint}, ${sub.keys.p256dh}, ${sub.keys.auth})
      ON CONFLICT (endpoint) 
      DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth
    `;
    return { success: true };
  } catch (error) {
    console.error("Neon Error:", error);
    return { success: false, error: "Database error" };
  }
}

export async function unsubscribeUser(endpoint: string) {
  await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
  return { success: true };
}

export async function sendNotificationToAll(message: string) {
  const subs = await sql`SELECT * FROM push_subscriptions`;

  const results = await Promise.all(
    subs.map(async (row) => {
      const pushSubscription = {
        endpoint: row.endpoint,
        keys: {
          p256dh: row.p256dh,
          auth: row.auth,
        },
      };

      try {
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify({
            title: "Doggyscan Update 🐾",
            body: message,
            icon: "/icons/icon-192x192.png",
            badge: "/icons/badge.png",
          }),
        );
        return { success: true };
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Gebruiker heeft app verwijderd -> weg uit Neon
          await sql`DELETE FROM push_subscriptions WHERE endpoint = ${row.endpoint}`;
        }
        return { success: false };
      }
    }),
  );

  return results;
}
