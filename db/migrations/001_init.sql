CREATE TABLE IF NOT EXISTS reps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pipeline_stages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  value_cents BIGINT NOT NULL DEFAULT 0,
  rep_id INTEGER NOT NULL REFERENCES reps(id),
  stage_id INTEGER NOT NULL REFERENCES pipeline_stages(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS deal_stage_history (
  id SERIAL PRIMARY KEY,
  deal_id INTEGER NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  stage_id INTEGER NOT NULL REFERENCES pipeline_stages(id),
  entered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  exited_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  rep_id INTEGER REFERENCES reps(id),
  month DATE NOT NULL,
  revenue_target_cents BIGINT NOT NULL DEFAULT 0,
  deals_target INTEGER NOT NULL DEFAULT 0,
  UNIQUE (rep_id, month)
);

CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_rep ON deals(rep_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_stage_history_deal ON deal_stage_history(deal_id);
