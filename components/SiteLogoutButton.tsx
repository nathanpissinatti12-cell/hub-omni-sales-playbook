"use client";

import { useRouter } from "next/navigation";

export function SiteLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm hover:underline"
      style={{ color: "#f5f5f0" }}
    >
      Sair
    </button>
  );
}
