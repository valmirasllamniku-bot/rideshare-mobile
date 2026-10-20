
-- Java 5 - Skema per Ndërtimtari
-- Ky skedar nuk e fshin asnje tabele ekzistuese.

CREATE TABLE IF NOT EXISTS profilet (
    github_id TEXT PRIMARY KEY,
    emri TEXT NOT NULL,
    roli TEXT NOT NULL DEFAULT 'klient'
        CHECK (roli IN ('klient', 'admin')),
    krijuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kerkesa_oferta (
    id SERIAL PRIMARY KEY,
    projekt_id INTEGER NOT NULL REFERENCES projektet(id),
    github_id TEXT NOT NULL REFERENCES profilet(github_id),
    mesazhi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ne pritje',
    krijuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
