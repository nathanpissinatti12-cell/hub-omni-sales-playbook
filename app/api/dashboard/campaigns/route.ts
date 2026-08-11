import { NextResponse } from "next/server";
import { getCampaignPerformance } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getCampaignPerformance();
  return NextResponse.json(data);
}
