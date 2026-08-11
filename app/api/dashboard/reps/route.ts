import { NextResponse } from "next/server";
import { getRepPerformance } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getRepPerformance();
  return NextResponse.json(data);
}
