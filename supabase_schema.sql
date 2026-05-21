-- ════════════════════════════════════════════════════════════════
-- Excel Data Entry App — Supabase SQL Schema
-- Supabase SQL Editor এ রান করুন
-- ════════════════════════════════════════════════════════════════

-- 1. user_profiles টেবিল (Admin approval system)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'pending'  -- 'pending' | 'approved' | 'rejected'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. form_configs টেবিল (প্রতি user এর প্রতি Excel এর column config)
CREATE TABLE IF NOT EXISTS public.form_configs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id         TEXT NOT NULL,  -- Excel tab ID
  columns         JSONB DEFAULT '[]',
  duplicate_check BOOLEAN DEFAULT FALSE,
  primary_column  TEXT DEFAULT '',
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, form_id)
);

-- 3. entries টেবিল (প্রতি row এর ডেটা)
CREATE TABLE IF NOT EXISTS public.entries (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id     TEXT NOT NULL,  -- Excel tab ID
  serial_no   INTEGER NOT NULL,
  data        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════
-- Row Level Security (RLS) চালু করুন
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_configs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries        ENABLE ROW LEVEL SECURITY;

-- user_profiles: যে কেউ INSERT করতে পারবে (registration), 
--   কিন্তু SELECT/UPDATE শুধু নিজের বা admin এর
DROP POLICY IF EXISTS "profiles_insert" ON public.user_profiles;
CREATE POLICY "profiles_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_select_own" ON public.user_profiles;
CREATE POLICY "profiles_select_own" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Admin সব দেখতে ও আপডেট করতে পারবে
-- Admin email টি auth.users থেকে খোঁজে, নিচের email পরিবর্তন করুন
DROP POLICY IF EXISTS "profiles_admin_all" ON public.user_profiles;
CREATE POLICY "profiles_admin_all" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'admin@example.com'  -- ← এখানে আপনার admin email দিন
    )
  );

-- form_configs: নিজের ডেটা নিজে দেখবে ও পরিবর্তন করবে
DROP POLICY IF EXISTS "configs_own" ON public.form_configs;
CREATE POLICY "configs_own" ON public.form_configs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- entries: নিজের ডেটা নিজে দেখবে ও পরিবর্তন করবে
DROP POLICY IF EXISTS "entries_own" ON public.entries;
CREATE POLICY "entries_own" ON public.entries
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════
-- Indexes (performance)
-- ════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_form_configs_user_form ON public.form_configs(user_id, form_id);
CREATE INDEX IF NOT EXISTS idx_entries_user_form       ON public.entries(user_id, form_id);
CREATE INDEX IF NOT EXISTS idx_entries_serial          ON public.entries(user_id, form_id, serial_no);
CREATE INDEX IF NOT EXISTS idx_profiles_user           ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status         ON public.user_profiles(status);

-- ════════════════════════════════════════════════════════════════
-- সফলভাবে তৈরি হয়েছে!
-- এরপর App.jsx এ ADMIN_EMAIL পরিবর্তন করুন।
-- ════════════════════════════════════════════════════════════════
