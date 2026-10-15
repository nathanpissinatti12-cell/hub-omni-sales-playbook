"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Item "Onvox" do menu de cima: abre a lista de painéis de indicadores. As
 * unidades vêm prontas de quem renderiza, já filtradas pela permissão — o Head
 * recebe todas, o colaborador só a dele. Fica num componente de cliente porque
 * o layout é server component e o menu precisa de estado de aberto/fechado.
 */
export function MenuOnvox({ unidades }: { unidades: { slug: string; nome: string }[] }) {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora e no Esc — sem isso o menu fica preso aberto depois
  // de navegar com o teclado ou de clicar em outro lugar da página.
  useEffect(() => {
    if (!aberto) return;
    const aoClicar = (e: MouseEvent) => {
      if (caixa.current && !caixa.current.contains(e.target as Node)) setAberto(false);
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", aoClicar);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicar);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <div ref={caixa} className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="menu"
        className="flex items-center gap-1 text-sm hover:underline"
        style={{ color: "#f5f5f0" }}
      >
        Onvox
        <span className="text-[10px]" aria-hidden="true">
          {aberto ? "▲" : "▼"}
        </span>
      </button>

      {aberto && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border py-1 shadow-lg"
          style={{ background: "#141414", borderColor: "#ffffff1f" }}
        >
          {unidades.map((u) => (
            <Link
              key={u.slug}
              role="menuitem"
              href={`/dashboard/indicadores/${u.slug}`}
              onClick={() => setAberto(false)}
              className="block px-4 py-2 text-sm hover:bg-white/10"
              style={{ color: "#f5f5f0" }}
            >
              Painel de indicadores {u.nome}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
