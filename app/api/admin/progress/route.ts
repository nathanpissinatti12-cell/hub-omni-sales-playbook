import { NextResponse } from "next/server";
import { getAllProgress, listUsers } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const [progress, users] = await Promise.all([getAllProgress(), listUsers()]);
  return NextResponse.json({ progress, users });
}
