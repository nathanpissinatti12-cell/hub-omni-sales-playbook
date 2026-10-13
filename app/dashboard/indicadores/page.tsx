import { redirect } from "next/navigation";
import { UNIDADE_PADRAO } from "@/lib/indicadores";

// O painel virou um por unidade. Esta rota é a que existia antes da separação e
// continua valendo: manda pra Cerquilho, que é a unidade cujo histórico de
// lançamentos já estava aqui. Mantém funcionando o link do dashboard e
// qualquer favorito antigo.
export default function PainelIndicadoresPage() {
  redirect(`/dashboard/indicadores/${UNIDADE_PADRAO}`);
}
