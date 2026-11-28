-- Ekzekutoje një herë në degën Production të Neon-it për njoftimet në telefon.
ALTER TABLE public.kerkesa_oferta
  DROP CONSTRAINT IF EXISTS kerkesa_oferta_status_check;

ALTER TABLE public.kerkesa_oferta
  ADD CONSTRAINT kerkesa_oferta_status_check
  CHECK (status IN ('e_re', 'ne pritje', 'ne_shqyrtim', 'pranuar', 'perfunduar', 'refuzuar'));

CREATE TABLE IF NOT EXISTS public.njoftimet (
  id BIGSERIAL PRIMARY KEY,
  github_id TEXT NOT NULL REFERENCES public.profilet(github_id) ON DELETE CASCADE,
  kerkesa_id INTEGER NOT NULL REFERENCES public.kerkesa_oferta(id) ON DELETE CASCADE,
  lloji TEXT NOT NULL CHECK (lloji IN ('pranuar', 'refuzuar')),
  krijuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lexuar_me TIMESTAMPTZ,
  CONSTRAINT njoftimet_kerkesa_id_key UNIQUE (kerkesa_id)
);

CREATE INDEX IF NOT EXISTS njoftimet_marresi_krijuar_idx
  ON public.njoftimet (github_id, krijuar_me DESC);

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  github_id TEXT NOT NULL REFERENCES public.profilet(github_id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  krijuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS push_subscriptions_github_id_idx
  ON public.push_subscriptions (github_id);
