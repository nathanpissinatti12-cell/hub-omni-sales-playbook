# Playbook de Vendas

App com o playbook do funil de vendas e um dashboard com dados ao vivo do Postgres.

## Setup

1. Instalar dependências:
   ```
   npm install
   ```
2. Criar um banco Postgres e configurar a conexão:
   ```
   cp .env.example .env
   ```
   Edite `.env` com a `DATABASE_URL` do seu banco.
3. Rodar as migrations (cria as tabelas):
   ```
   npm run db:migrate
   ```
4. (Opcional) Popular com dados fake para testar o dashboard:
   ```
   npm run db:seed
   ```
5. Subir o app:
   ```
   npm run dev
   ```
   - Playbook: http://localhost:3000/playbook
   - Dashboard: http://localhost:3000/dashboard

## Estrutura do banco

- `reps` — vendedores
- `pipeline_stages` — etapas do funil (Lead, Qualificação, Reunião, Proposta, Negociação, Fechamento)
- `deals` — oportunidades, com etapa atual, valor e status (open/won/lost)
- `deal_stage_history` — histórico de transição de etapa (usado para tempo médio por etapa)
- `goals` — metas mensais de receita/nº de deals por vendedor

Para conectar em um banco com um schema diferente, ajuste as queries em `db/queries.ts`.
