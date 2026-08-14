"use client";

import { useRouter } from "next/navigation";

export function DashboardTopBar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    router.push("/playbook");
    router.refresh();
  }

  return (
    <div className="mb-4 flex items-center justify-end">
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:brightness-110"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        Sair
      </button>
    </div>
  );
}
