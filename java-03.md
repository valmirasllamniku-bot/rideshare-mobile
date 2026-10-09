# Java 03 – Ndërtimtari

## Prova 1 – Faqja kryesore

**Hapat:** E hapa aplikacionin në shfletues përmes `http://localhost:3000` dhe kontrollova kartat e projekteve.

**Rezultati:** Faqja kryesore u hap me sukses dhe u shfaqën tri projektet e ndërtimtarisë.

## Prova 2 – Detajet dhe kërkesa për ofertë

**Hapat:** Klikova te “Shiko projektin”, kontrollova detajet dhe pastaj klikova te “Kërko ofertë”.

**Rezultati:** Detajet e projektit u shfaqën dhe faqja e kërkesës u hap me mesazhin “Simulim: Në pritje”.

## Prova 3 – Projekti që nuk ekziston

**Hapat:** Në shfletues hapa adresën `http://localhost:3000/projekti/99`.

**Rezultati:** Aplikacioni shfaqi mesazhin “Projekti nuk u gjet”, sepse projekti me ID 99 nuk ekziston.

## Përfundim

U testuan faqja kryesore, detajet e projektit, kërkesa për ofertë dhe rasti kur projekti nuk ekziston.

