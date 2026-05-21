
-- user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- form_configs table
CREATE TABLE IF NOT EXISTS public.form_configs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id         TEXT NOT NULL,
  columns         JSONB DEFAULT '[]',
  duplicate_check BOOLEAN DEFAULT FALSE,
  primary_column  TEXT DEFAULT '',
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, form_id)
);

-- entries table
CREATE TABLE IF NOT EXISTS public.entries (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id     TEXT NOT NULL,
  serial_no   INTEGER NOT NULL,
  data        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_configs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries        ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "profiles_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_select_own" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles_admin_all" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'mahmud716868@gmail.com'
    )
  );

-- form_configs policies
CREATE POLICY "configs_own" ON public.form_configs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- entries policies
CREATE POLICY "entries_own" ON public.entries
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- indexes
CREATE INDEX IF NOT EXISTS idx_form_configs_user_form ON public.form_configs(user_id, form_id);
CREATE INDEX IF NOT EXISTS idx_entries_user_form       ON public.entries(user_id, form_id);
CREATE INDEX IF NOT EXISTS idx_entries_serial          ON public.entries(user_id, form_id, serial_no);
CREATE INDEX IF NOT EXISTS idx_profiles_user           ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status         ON public.user_profiles(status);
