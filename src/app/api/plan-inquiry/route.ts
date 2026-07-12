import { NextResponse } from "next/server";
import { planInquirySchema } from "@/lib/validation/plan-inquiry";
import { env } from "@/env";
import { z } from "zod";

// TODO(phase-2): Wire to UI. This endpoint is not called from any frontend code yet.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = planInquirySchema.parse(body);

    const appsScriptUrl = env.PLANNING_APPS_SCRIPT_URL;
    if (!appsScriptUrl) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Apps Script returned", response.status);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
