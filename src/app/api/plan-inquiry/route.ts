import { NextResponse } from "next/server";

// TODO(phase-2): Wire to UI. This endpoint is not called from any frontend code yet.

export async function POST() {
  return NextResponse.json({ ok: true });
}
