
-- Skema e databazes per projektin Ndertimtari

CREATE TABLE IF NOT EXISTS projektet (
  id INTEGER PRIMARY KEY,
  emri TEXT NOT NULL,
  lokacioni TEXT NOT NULL,
  cmimi TEXT NOT NULL,
  vende INTEGER NOT NULL DEFAULT 0,
  pershkrimi TEXT NOT NULL DEFAULT ''
);

INSERT INTO projektet (id, emri, lokacioni, cmimi, vende, pershkrimi)
VALUES
  (1, 'Ndertim shtepie', 'Prishtine', 'Nga 30,000 EUR', 3, 'Realizo shtepine tende te re.'),
  (2, 'Ndertim objekti afarist', 'Fushe Kosove', 'Nga 50,000 EUR', 2, 'Projekt per ndertimin e objektit afarist.'),
  (3, 'Renovim banese', 'Prishtine', 'Nga 10,000 EUR', 0, 'Rifresko dhe rinovo banesen tende.')
ON CONFLICT (id) DO UPDATE SET
  emri = EXCLUDED.emri,
  lokacioni = EXCLUDED.lokacioni,
  cmimi = EXCLUDED.cmimi,
  vende = EXCLUDED.vende,
  pershkrimi = EXCLUDED.pershkrimi;

SELECT * FROM projektet ORDER BY id;