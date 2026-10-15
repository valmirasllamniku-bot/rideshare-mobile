# Java 4 – Databaza Neon

## Projekti: Ndërtimtari

Qëllimi i këtij ushtrimi është lidhja e aplikacionit Ndërtimtari me databazën Neon dhe shfaqja e projekteve nga databaza.

## Prova 1 – Lista e projekteve

**Hapat:** Nisa aplikacionin Next.js dhe hapa faqen kryesore në `http://localhost:3000`. Kontrollova nëse lista e projekteve të ndërtimtarisë ngarkohet nga databaza Neon.

**Rezultati:** Duhet të verifikohet në aplikacion nëse projektet shfaqen me të dhënat e ruajtura në databazën Neon.

## Prova 2 – Detajet e projektit

**Hapat:** Hapa faqen e detajeve të një projekti përmes adresës së tij, për shembull `/udhetimi/1`, dhe kontrollova të dhënat e projektit.

**Rezultati:** Duhet të verifikohet nëse shfaqen emri, lokacioni, çmimi dhe përshkrimi i projektit nga databaza Neon.

## Prova 3 – Projekti që nuk ekziston

**Hapat:** Hapa adresën `/udhetimi/99` për të kontrolluar sjelljen e aplikacionit kur kërkohet një projekt që nuk ekziston në databazë.

**Rezultati:** Duhet të verifikohet nëse aplikacioni shfaq mesazhin se projekti nuk u gjet.

## Skema e databazës

Tabela `projektet` ruan informacionet për projektet e ndërtimtarisë, duke përfshirë identifikuesin, emrin, lokacionin, çmimin, numrin e vendeve dhe përshkrimin.

## Përfundim

Në këtë ushtrim synohet lidhja e aplikacionit Ndërtimtari me databazën Neon, marrja e të dhënave nga databaza dhe shfaqja e tyre
