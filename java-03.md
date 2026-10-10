# Java 03 – Construction Projects

## Prova 1: Faqja kryesore

**Hapat:**
1. E hapa aplikacionin në shfletues përmes `http://localhost:3000`.
2. Kontrollova listën e projekteve të ndërtimtarisë.
3. Kontrollova nëse kartat e projekteve shfaqeshin si duhet.

**Rezultati:**
Faqja kryesore u hap me sukses dhe u shfaqën tri projekte të ndërtimtarisë. Kartat e projekteve u paraqitën në faqe.

## Prova 2: Detajet e projektit

**Hapat:**
1. Në faqen kryesore klikova te butoni “Shiko projektin”.
2. Kontrollova faqen e detajeve të projektit.
3. Hapa edhe projektin me ID `99` për të testuar një projekt që nuk ekziston.

**Rezultati:**
Detajet e projektit u shfaqën me sukses. Kur hapa projektin me ID `99`, aplikacioni shfaqi mesazhin “Projekti nuk u gjet”.

## Prova 3: Kërkesa për ofertë

**Hapat:**
1. Hapa detajet e një projekti.
2. Klikova te butoni “Kërko ofertë”.
3. Kontrollova rezultatin në faqen e kërkesës.

**Rezultati:**
Faqja e kërkesës për ofertë u hap me sukses dhe u shfaq mesazhi “Simulim: Në pritje”. Ky funksionalitet është demonstrim dhe nuk dërgon kërkesë reale.

## Përfundim

Gjatë testimit u kontrolluan faqja kryesore, kartat e projekteve, faqja e detajeve, trajtimi i një projekti që nuk ekziston dhe funksionaliteti i kërkesës për ofertë. Rezultatet treguan se këto pjesë të aplikacionit funksionuan sipas testimeve të kryera.
