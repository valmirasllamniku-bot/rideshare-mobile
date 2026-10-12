# Java 4 – Databaza Neon

## Projekti: Ndërtimtari

Aplikacion web për shfaqjen e projekteve të ndërtimtarisë, i zhvilluar me Next.js dhe TypeScript, me përdorimin e databazës Neon.

## Prova 1 – Lista e projekteve

**Hapat:** Hap aplikacionin në `http://localhost:3000`.

**Rezultati:** Faqja kryesore u hap me sukses dhe u shfaqën projektet e ndërtimtarisë me informacionet përkatëse. Aplikacioni shfaq listën e projekteve në mënyrë të rregullt.

## Prova 2 – Detajet e projektit

**Hapat:** Hapa adresën `http://localhost:3000/udhetimi/1` për të parë detajet e projektit.

**Rezultati:** Faqja e detajeve u hap me sukses dhe u shfaqën informacionet për projektin e zgjedhur. Përdoruesi mund të shikojë detajet e projektit.

## Prova 3 – Kërkesa për projekt

**Hapat:** Hapa adresën `http://localhost:3000/udhetimi/1/kerkesa` për të kontrolluar faqen e kërkesës.

**Rezultati:** Faqja e kërkesës u hap me sukses dhe u shfaq ndërfaqja për kërkesën e projektit. Përdoruesi mund të vazhdojë me plotësimin e kërkesës sipas funksionalitetit të aplikacionit.

## Databaza Neon

Databaza Neon përdoret për ruajtjen dhe marrjen e të dhënave të projekteve. Skema e databazës gjendet në skedarin `schema.sql`, ndërsa lidhja me databazën menaxhohet përmes `src/lib/db.ts`.

## Teknologjitë e përdorura

- Next.js
- TypeScript
- Neon
- SQL
- GitHub

