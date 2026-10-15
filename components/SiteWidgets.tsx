"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/ChatWidget";
import { SuggestionWidget } from "@/components/SuggestionWidget";

export function SiteWidgets() {
  const pathname = usePathname();

  // O chat e a caixa de sugestão são ferramentas de quem está lendo o playbook:
  // tirar dúvida do conteúdo e sugerir melhoria do processo. Fora dali (dashboard,
  // painéis de indicadores, admin, equipamentos, login) eles só ocupavam o canto
  // da tela e cobriam conteúdo, então aparecem apenas em /playbook.
  if (!pathname?.startsWith("/playbook")) return null;

  return (
    <>
      <ChatWidget />
      <SuggestionWidget />
    </>
  );
}
