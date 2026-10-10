# Java 3 – Projektet dhe faqet

## Prova 1

**Hapat e testimit:** Hapa faqen kryesore në adresën `http://localhost:3000` dhe kontrollova listën e projekteve të ndërtimtarisë.

**Rezultati real:** Faqja kryesore u hap normalisht dhe tri projektet e ndërtimtarisë u shfaqën në ekran.

## Prova 2

**Hapat e testimit:** Klikova te butoni “Shiko projektin” për të hapur detajet e projektit dhe pastaj hapa adresën `http://localhost:3000/projekti/99`.

**Rezultati real:** Detajet e projektit u shfaqën dhe për ID 99 aplikacioni shfaqi mesazhin “Projekti nuk u gjet”, sepse projekti nuk ekziston.

## Prova 3

**Hapat e testimit:** Hapa detajet e projektit dhe klikova te butoni “Kërko ofertë”.

**Rezultati real:** U shfaq simulimi “Në pritje”. Kërkesa për ofertë nuk u dërgua si kërkesë reale.

## Çfarë nuk funksionon ende

Kërkesa për ofertë është vetëm simulim. Aplikacioni nuk dërgon kërkesë reale.
