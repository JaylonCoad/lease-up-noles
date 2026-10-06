import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// GET /api/health: confirms the app can reach Supabase with the configured keys.
// Returns how many listings exist, which also proves the schema is in place.
export async function GET() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, listingCount: count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
