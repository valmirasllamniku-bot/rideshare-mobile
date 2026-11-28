import "server-only";
import { getSql } from "@/lib/db";

type PushSubscriptionInput = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

type WebPushApi = {
  setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
  sendNotification(
    subscription: PushSubscriptionInput,
    payload?: string,
    options?: { TTL?: number; urgency?: "very-low" | "low" | "normal" | "high" }
  ): Promise<unknown>;
};

const webpush = require("web-push") as WebPushApi;

export type NjoftimPush = {
  title: string;
  body: string;
  url: string;
  tag: string;
};

export async function dergoNjoftimPush(
  githubId: string,
  njoftim: NjoftimPush
): Promise<void> {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    console.warn("Web Push nuk është konfiguruar në server.");
    return;
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    const sql = getSql();
    const subscriptions = await sql`
      SELECT endpoint, p256dh, auth
      FROM public.push_subscriptions
      WHERE github_id = ${githubId}
    `;

    await Promise.all(subscriptions.map(async (row) => {
      const subscription: PushSubscriptionInput = {
        endpoint: String(row.endpoint),
        keys: { p256dh: String(row.p256dh), auth: String(row.auth) },
      };

      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify(njoftim),
          { TTL: 60, urgency: "high" }
        );
      } catch (error) {
        const statusCode =
          typeof error === "object" && error !== null && "statusCode" in error
            ? Number(error.statusCode)
            : 0;

        if (statusCode === 404 || statusCode === 410) {
          await sql`
            DELETE FROM public.push_subscriptions
            WHERE endpoint = ${subscription.endpoint}
          `;
        } else {
          console.error("Njoftimi push nuk u dërgua.", error);
        }
      }
    }));
  } catch (error) {
    // Hyrja/pranimi mbetet i ruajtur edhe kur shërbimi push nuk përgjigjet.
    console.error("Gabim në dërgimin e njoftimit push:", error);
  }
}
