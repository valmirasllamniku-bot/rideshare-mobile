-- Java 5: profilet dhe kerkesa per oferta ne Ndërtimtari

CREATE TABLE IF NOT EXISTS profilet (
  github_id TEXT PRIMARY KEY,
  emri TEXT NOT NULL,
  roli TEXT NOT NULL DEFAULT 'klient'
    CHECK (roli IN ('klient', 'admin'))
);

CREATE TABLE IF NOT EXISTS kerkesa_oferta (
  id BIGSERIAL PRIMARY KEY,
  projekt_id INTEGER NOT NULL REFERENCES projektet(id),
  github_id TEXT NOT NULL REFERENCES profilet(github_id),
  mesazhi TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'e_re'
    CHECK (status IN ('e_re', 'ne_shqyrtim', 'perfunduar')),
  krijuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Llogari fiktive per te provuar refuzimin e ndryshimit pa leje.
INSERT INTO profilet (github_id, emri, roli)
VALUES ('DEMO-KLIENT-1', 'Klienti demo', 'klient')
ON CONFLICT (github_id) DO NOTHING;

-- Krijo nje kerkese demo vetem nese projekti me ID 1 ekziston.
INSERT INTO kerkesa_oferta (id, projekt_id, github_id, mesazhi, status)
SELECT 1, 1, 'DEMO-KLIENT-1',
       'Kerkese demo per prove', 'e_re'
WHERE EXISTS (SELECT 1 FROM projektet WHERE id = 1)
ON CONFLICT (id) DO NOTHING;

-- Sinkronizo numrin automatik te kerkesave.
SELECT setval(
  pg_get_serial_sequence('kerkesa_oferta', 'id')::regclass,
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM kerkesa_oferta), 1)
);

SELECT id, projekt_id, github_id, mesazhi
FROM kerkesa_oferta
ORDER BY id;