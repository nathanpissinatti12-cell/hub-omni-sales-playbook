"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/ChatWidget";
import { SuggestionWidget } from "@/components/SuggestionWidget";

export function SiteWidgets() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <ChatWidget />
      <SuggestionWidget />
    </>
  );
}
