<<<<<<< HEAD

-- user_profiles table
=======
-- ════════════════════════════════════════════════════════════════
-- Excel Data Entry App — Supabase SQL Schema
-- Supabase SQL Editor এ রান করুন
-- ════════════════════════════════════════════════════════════════

-- 1. user_profiles টেবিল (Admin approval system)
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT DEFAULT '',
<<<<<<< HEAD
  status      TEXT NOT NULL DEFAULT 'pending'
=======
  status      TEXT NOT NULL DEFAULT 'pending'  -- 'pending' | 'approved' | 'rejected'
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
              CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

<<<<<<< HEAD
-- form_configs table
CREATE TABLE IF NOT EXISTS public.form_configs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id         TEXT NOT NULL,
=======
-- 2. form_configs টেবিল (প্রতি user এর প্রতি Excel এর column config)
CREATE TABLE IF NOT EXISTS public.form_configs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id         TEXT NOT NULL,  -- Excel tab ID
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
  columns         JSONB DEFAULT '[]',
  duplicate_check BOOLEAN DEFAULT FALSE,
  primary_column  TEXT DEFAULT '',
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, form_id)
);

<<<<<<< HEAD
-- entries table
CREATE TABLE IF NOT EXISTS public.entries (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id     TEXT NOT NULL,
=======
-- 3. entries টেবিল (প্রতি row এর ডেটা)
CREATE TABLE IF NOT EXISTS public.entries (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id     TEXT NOT NULL,  -- Excel tab ID
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
  serial_no   INTEGER NOT NULL,
  data        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

<<<<<<< HEAD
-- RLS
=======
-- ════════════════════════════════════════════════════════════════
-- Row Level Security (RLS) চালু করুন
-- ════════════════════════════════════════════════════════════════

>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_configs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries        ENABLE ROW LEVEL SECURITY;

<<<<<<< HEAD
-- user_profiles policies
CREATE POLICY "profiles_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_select_own" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

=======
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
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
CREATE POLICY "profiles_admin_all" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
<<<<<<< HEAD
      AND email = 'mahmud716868@gmail.com'
    )
  );

-- form_configs policies
=======
      AND email = 'admin@example.com'  -- ← এখানে আপনার admin email দিন
    )
  );

-- form_configs: নিজের ডেটা নিজে দেখবে ও পরিবর্তন করবে
DROP POLICY IF EXISTS "configs_own" ON public.form_configs;
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
CREATE POLICY "configs_own" ON public.form_configs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

<<<<<<< HEAD
-- entries policies
=======
-- entries: নিজের ডেটা নিজে দেখবে ও পরিবর্তন করবে
DROP POLICY IF EXISTS "entries_own" ON public.entries;
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
CREATE POLICY "entries_own" ON public.entries
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

<<<<<<< HEAD
-- indexes
=======
-- ════════════════════════════════════════════════════════════════
-- Indexes (performance)
-- ════════════════════════════════════════════════════════════════
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
CREATE INDEX IF NOT EXISTS idx_form_configs_user_form ON public.form_configs(user_id, form_id);
CREATE INDEX IF NOT EXISTS idx_entries_user_form       ON public.entries(user_id, form_id);
CREATE INDEX IF NOT EXISTS idx_entries_serial          ON public.entries(user_id, form_id, serial_no);
CREATE INDEX IF NOT EXISTS idx_profiles_user           ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status         ON public.user_profiles(status);
<<<<<<< HEAD
=======

-- ════════════════════════════════════════════════════════════════
-- সফলভাবে তৈরি হয়েছে!
-- এরপর App.jsx এ ADMIN_EMAIL পরিবর্তন করুন।
-- ════════════════════════════════════════════════════════════════
>>>>>>> 2ae091128b539fa5deb7757824fa493a4fe8eca8
