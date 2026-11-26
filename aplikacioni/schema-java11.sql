-- Java 11: njoftime personale kur admini i përgjigjet kërkesës së klientit.
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