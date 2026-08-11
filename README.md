# Playbook de Vendas

App com os playbooks comerciais (TakeFlow, Onvox) e um dashboard com dados ao vivo
da base de prospecção/enriquecimento de leads (Apollo).

## Setup

1. Instalar dependências:
   ```
   npm install
   ```
2. Configurar a conexão com o banco de prospecção:
   ```
   cp .env.example .env
   ```
   Edite `.env` com a `DATABASE_URL`. **Use um usuário somente leitura** (ex:
   `dashboard_readonly`), nunca a credencial master do banco — o dashboard não
   precisa (e não deve) ter permissão de escrita.
3. Subir o app:
   ```
   npm run dev
   ```
   - Playbook TakeFlow: http://localhost:3000/playbook
   - Playbook Onvox: http://localhost:3000/playbook/onvox
   - Dashboard: http://localhost:3000/dashboard

## Sobre o banco de dados do dashboard

O dashboard **não é dono do schema** — ele lê direto do banco de produção da
base de prospecção (`baseapollo`), que já existe e é mantido por outro
processo. As tabelas usadas:

- `campanhas` — campanhas de prospecção
- `fila_processamento` — fila de domínios sendo processados (status: pendente,
  processando, processado, em pausa, erro)
- `empresas` — empresas enriquecidas (decisor, contato, `enviado_meetime`)
- `leads_sem_contato` — leads sem contato/dados suficientes

As queries agregadas ficam em `db/queries.ts`. Não há migrations nem seed
neste projeto — qualquer alteração de schema deve ser coordenada com quem
mantém o banco de origem.
<!-- deploy-check: 2026-08-11T18:14:25Z -->
