
CREATE TABLE IF NOT EXISTS projektet (
  id INTEGER PRIMARY KEY,
  emri TEXT NOT NULL,
  lokacioni TEXT NOT NULL,
  cmimi TEXT NOT NULL,
  vende INTEGER NOT NULL CHECK (vende >= 0),
  pershkrimi TEXT NOT NULL
);

INSERT INTO projektet
  (id, emri, lokacioni, cmimi, vende, pershkrimi)
VALUES
  (1, 'Ndërtim shtëpie', 'Prishtinë', 'Nga 30,000 €', 3,
   'Projekt për ndërtimin e një shtëpie të re.'),
  (2, 'Ndërtim objekti afarist', 'Fushë Kosovë', 'Nga 50,000 €', 2,
   'Projekt për ndërtimin e një objekti afarist.'),
  (3, 'Renovim banese', 'Prishtinë', 'Nga 10,000 €', 0,
   'Projekt për renovimin e një banese ekzistuese.')
ON CONFLICT (id) DO NOTHING;

SELECT * FROM projektet ORDER BY id;
