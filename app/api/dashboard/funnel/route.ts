import { NextResponse } from "next/server";
import { getFunnel } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getFunnel();
  return NextResponse.json(data);
}
