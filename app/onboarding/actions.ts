"use server";

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function saveOnboardingData(formData: {
  dogName: string;
  plan: string;
  count: number;
}) {
  const { userId } = await auth();

  if (!userId) throw new Error("Niet ingelogd");

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      INSERT INTO dogs (user_id, dog_name, plan_type, dog_count)
      VALUES (${userId}, ${formData.dogName}, ${formData.plan}, ${formData.count})
    `;
    return { success: true };
  } catch (error) {
    console.error("Neon Error:", error);
    return { success: false, error: "Database fout" };
  }
}
