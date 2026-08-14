"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Mostra só a seção cujo #hash da URL aponta pra ela (ou pra algo dentro dela,
// como um sub-tópico ou ICP específico) - as demais ficam escondidas. Sem hash
// na URL, só a seção marcada com defaultOpen aparece (a primeira da página).
export function HashSection({
  id,
  className,
  defaultOpen,
  children,
}: {
  id: string;
  className?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(!!defaultOpen);

  useEffect(() => {
    function evaluate() {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) {
        setVisible(!!defaultOpen);
        return;
      }
      if (hash === id) {
        setVisible(true);
        return;
      }
      const target = document.getElementById(hash);
      setVisible(!!(target && ref.current && ref.current.contains(target)));
    }
    evaluate();
    window.addEventListener("hashchange", evaluate);
    return () => window.removeEventListener("hashchange", evaluate);
  }, [id, defaultOpen]);

  return (
    <section id={id} ref={ref} className={className} hidden={!visible}>
      {children}
    </section>
  );
}
