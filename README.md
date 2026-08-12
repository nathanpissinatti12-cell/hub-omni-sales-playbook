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
   - Painel Administrativo: http://localhost:3000/admin

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

## Painel Administrativo (`/admin`)

O Painel Administrativo usa um banco **próprio**, separado do `baseapollo`
(que é somente leitura e não é nosso schema). Ele guarda usuários criados
pelo admin, permissões, sugestões enviadas pelo site e o histórico de ações.

1. Provisione um banco Postgres à parte (ex: Neon, Supabase, RDS) e aponte
   `ADMIN_DATABASE_URL` para ele no `.env`.
2. Defina `ADMIN_PASSWORD` (senha única para entrar em `/admin`) e, opcionalmente,
   `ADMIN_SESSION_SECRET` (se não definido, `ADMIN_PASSWORD` também assina o
   cookie de sessão).
3. Rode as migrations desse banco:
   ```
   npm run db:admin:migrate
   ```
4. Acesse `/admin/login` com a senha definida.

Tabelas (`db/adminMigrations/001_init.sql`):

- `admin_users` — usuários criados no painel (nome, e-mail, senha com hash,
  foto opcional, nível de acesso BDR/Closer/Root, nível BDR quando aplicável,
  ativo/inativo).
- `admin_history` — log de ações administrativas (criação de usuário,
  alteração de permissão, ativação/desativação).
- `suggestions` — sugestões enviadas pelo botão flutuante 💡 disponível no
  playbook público (sem exigir login).

O login de `/admin` é uma senha única de administrador (cookie de sessão
assinado, 8h de validade) — os usuários criados no painel ainda não têm login
próprio no restante do site; o campo de senha fica pronto para quando isso
for implementado.
