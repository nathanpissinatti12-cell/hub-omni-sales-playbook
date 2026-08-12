import { NextResponse } from "next/server";
import { listHistory } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const history = await listHistory();
  return NextResponse.json(history);
}
