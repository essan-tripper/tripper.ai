import { NextResponse } from "next/server";
import { auth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { getOrdersWithItems } from "@/lib/order-queries";
import { aj } from "@/lib/arcjet";
import { slidingWindow } from "@arcjet/next";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const orders = await getOrdersWithItems(session.user.id);
  return NextResponse.json(orders);
}
