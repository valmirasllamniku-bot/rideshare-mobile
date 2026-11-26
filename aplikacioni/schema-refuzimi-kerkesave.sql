-- Lejo statusin e refuzuar për kërkesat që nuk mund të realizohen.
ALTER TABLE public.kerkesa_oferta
  DROP CONSTRAINT IF EXISTS kerkesa_oferta_status_check;

ALTER TABLE public.kerkesa_oferta
  ADD CONSTRAINT kerkesa_oferta_status_check
  CHECK (status IN ('e_re', 'ne pritje', 'ne_shqyrtim', 'perfunduar', 'refuzuar'));