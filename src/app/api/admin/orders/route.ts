import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { aj } from "@/lib/arcjet";
import { slidingWindow } from "@arcjet/next";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());

async function checkAdmin(): Promise<{ error?: NextResponse }> {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return {};
}

export async function PATCH(request: Request) {
  const adminCheck = await checkAdmin();
  if (adminCheck.error) return adminCheck.error;

  const ajDecision = await aj.withRule(
    slidingWindow({ mode: "DRY_RUN", interval: 60, max: 30 })
  ).protect(request);

  if (ajDecision.isDenied()) {
    if (ajDecision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (ajDecision.isErrored()) {
    console.error("Arcjet error:", ajDecision.reason);
  }

  const body = await request.json();
  const { orderId, deliveryStatus } = body;

  if (!orderId || !deliveryStatus) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(deliveryStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await db.update(orders).set({ deliveryStatus, updatedAt: new Date() }).where(eq(orders.id, orderId));

  return NextResponse.json({ success: true });
}
