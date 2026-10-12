# Java 4 – Databaza Neon

## Projekti
Ndërtimtari

## Prova 1 – Lista e projekteve

**Hapat:** Hapa faqen kryesore në `http://localhost:3000`.

**Rezultati:** U shfaqën projektet e ndërtimtarisë në listë. Të dhënat u morën nga databaza Neon.

## Prova 2 – Detajet e projektit

**Hapat:** Hapa faqen `http://localhost:3000/projekti/1` për të parë detajet e projektit të parë.

**Rezultati:** U shfaqën detajet e projektit, duke përfshirë emrin, lokacionin, çmimin dhe përshkrimin.

## Prova 3 – Projekt që nuk ekziston

**Hapat:** Hapa faqen `http://localhost:3000/projekti/99` për të kontrolluar sjelljen e aplikacionit kur projekti nuk ekziston.

**Rezultati:** Aplikacioni shfaqi mesazhin “Projekti nuk u gjet” dhe mundësinë për t'u kthyer te lista e projekteve.

## Skema e databazës

Skedari `schema.sql` përmban strukturën e tabelës `projektet` dhe tri të dhënat fillestare për projektet e ndërtimtarisë.

