import { cookies } from "next/headers";
import { SITE_SESSION_COOKIE, readSiteSession, type SiteSession } from "./siteSession";

export async function getSiteSession(): Promise<SiteSession | null> {
  return readSiteSession(cookies().get(SITE_SESSION_COOKIE)?.value);
}
