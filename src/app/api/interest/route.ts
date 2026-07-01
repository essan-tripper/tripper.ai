import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { interestEmails } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { aj } from "@/lib/arcjet";
import { slidingWindow } from "@arcjet/next";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: Request) {
  const ajDecision = await aj.withRule(
    slidingWindow({ mode: "DRY_RUN", interval: 60, max: 10 })
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

  try {
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    await db.insert(interestEmails).values({
      id: `int_${nanoid(16)}`,
      email: email.toLowerCase(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Email already registered or invalid" }, { status: 400 });
  }
}
