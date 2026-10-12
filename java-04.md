# Java 4 – Databaza Neon

## Prova 1

Hapat: Hapa `http://localhost:3000` në shfletues.

Rezultati: Faqja kryesore e aplikacionit Ndërtimtari u hap dhe shfaqi projektet e ndërtimtarisë.

## Prova 2

Hapat: Hapa `http://localhost:3000/projekti/1` në shfletues.

Rezultati: U hap faqja e detajeve për projektin me ID 1.

## Prova 3

Hapat: Hapa `http://localhost:3000/projekti/99` në shfletues.

Rezultati: U shfaq titulli “Projekti nuk u gjet” dhe mesazhi “Ky projekt nuk ekziston”.

## Skema e databazës

Skedari `schema.sql` përmban strukturën e tabelës `projektet` dhe të dhënat fillestare të projekteve.