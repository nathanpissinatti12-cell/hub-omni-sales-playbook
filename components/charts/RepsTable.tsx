export type RepRow = {
  id: number;
  name: string;
  deals_won: number;
  revenue_cents: string;
  avg_ticket_cents: string;
};

function centsToBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function RepsTable({ data }: { data: RepRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
            <th className="px-4 py-2 font-medium">Vendedor</th>
            <th className="px-4 py-2 font-medium">Deals ganhos</th>
            <th className="px-4 py-2 font-medium">Receita</th>
            <th className="px-4 py-2 font-medium">Ticket médio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rep) => (
            <tr key={rep.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              <td className="px-4 py-2">{rep.name}</td>
              <td className="px-4 py-2">{rep.deals_won}</td>
              <td className="px-4 py-2">{centsToBRL(Number(rep.revenue_cents))}</td>
              <td className="px-4 py-2">{centsToBRL(Number(rep.avg_ticket_cents))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
