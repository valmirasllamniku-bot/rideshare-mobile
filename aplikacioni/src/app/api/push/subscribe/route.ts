import { NextResponse } from "next/server";
import { profiliIm } from "@/lib/lejet";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function eshteEndpointPushValid(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:") return false;

    const host = url.hostname.toLowerCase();
    return (
      host === "fcm.googleapis.com" ||
      host === "web.push.apple.com" ||
      host.endsWith(".push.apple.com") ||
      host === "updates.push.services.mozilla.com" ||
      host.endsWith(".notify.windows.com")
    );
  } catch {
    return false;
  }
}

export async function GET() {
  const profile = await profiliIm();
  if (!profile) {
    return NextResponse.json({ error: "Hyr në llogarinë e klientit." }, { status: 401 });
  }
  if (profile.roli !== "klient") {
    return NextResponse.json({ error: "Njoftimet push aktivizohen për klientin." }, { status: 403 });
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return NextResponse.json({ error: "Njoftimet e telefonit nuk janë konfiguruar në Vercel." }, { status: 503 });
  }

  return NextResponse.json({ publicKey }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    const profile = await profiliIm();
    if (!profile) {
      return NextResponse.json({ error: "Hyr në llogarinë e klientit." }, { status: 401 });
    }
    if (profile.roli !== "klient") {
      return NextResponse.json({ error: "Njoftimet push aktivizohen për klientin." }, { status: 403 });
    }

    const body = await request.json();
    const endpoint = typeof body.endpoint === "string" ? body.endpoint : "";
    const p256dh = typeof body.keys?.p256dh === "string" ? body.keys.p256dh : "";
    const auth = typeof body.keys?.auth === "string" ? body.keys.auth : "";

    if (
      !eshteEndpointPushValid(endpoint) ||
      endpoint.length > 2048 ||
      !/^[A-Za-z0-9_-]{20,200}$/.test(p256dh) ||
      !/^[A-Za-z0-9_-]{10,100}$/.test(auth)
    ) {
      return NextResponse.json({ error: "Abonimi i njoftimeve nuk është valid." }, { status: 400 });
    }

    const sql = getSql();
    await sql`
      INSERT INTO public.push_subscriptions (github_id, endpoint, p256dh, auth)
      VALUES (${profile.id}, ${endpoint}, ${p256dh}, ${auth})
      ON CONFLICT (endpoint) DO UPDATE
      SET github_id = EXCLUDED.github_id,
          p256dh = EXCLUDED.p256dh,
          auth = EXCLUDED.auth,
          updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gabim gjatë ruajtjes së abonimit push:", error);
    return NextResponse.json({ error: "Nuk u aktivizuan njoftimet e telefonit." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const profile = await profiliIm();
    if (!profile) {
      return NextResponse.json({ error: "Hyr në llogarinë e klientit." }, { status: 401 });
    }

    const body = await request.json();
    const endpoint = typeof body.endpoint === "string" ? body.endpoint : "";
    if (!endpoint || endpoint.length > 2048) {
      return NextResponse.json({ error: "Abonimi nuk është valid." }, { status: 400 });
    }

    const sql = getSql();
    await sql`
      DELETE FROM public.push_subscriptions
      WHERE github_id = ${profile.id} AND endpoint = ${endpoint}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gabim gjatë çaktivizimit të abonimit push:", error);
    return NextResponse.json({ error: "Nuk u çaktivizuan njoftimet e telefonit." }, { status: 500 });
  }
}
