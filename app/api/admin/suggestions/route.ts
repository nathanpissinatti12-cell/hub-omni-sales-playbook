import { NextResponse } from "next/server";
import { listSuggestions } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const suggestions = await listSuggestions();
  return NextResponse.json(suggestions);
}
