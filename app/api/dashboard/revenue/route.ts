import { NextResponse } from "next/server";
import { getRevenueByMonth } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getRevenueByMonth();
  return NextResponse.json(data);
}
