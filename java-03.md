# Java 3 – Projektet dhe faqet

## Prova 1

Hapat e testimit: Hapa faqen kryesore në adresën `http://localhost:3000` dhe kontrollova listën e projekteve të ndërtimtarisë.

Rezultati real: Faqja kryesore u hap normalisht dhe projektet u shfaqën në ekran.

## Prova 2

Hapat e testimit: Hapa detajet e një projekti përmes butonit “Shiko projektin” dhe pastaj hapa adresën `http://localhost:3000/projekti/99`.

Rezultati real: Aplikacioni shfaqi mesazhin “Projekti nuk u gjet – Ky projekt nuk ekziston”, sepse nuk ka projekt me ID 99.

## Prova 3

Hapat e testimit: Hapa detajet e projektit dhe klikova te butoni “Kërko ofertë”.

Rezultati real: U shfaq simulimi “Në pritje”. Kërkesa për ofertë nuk u dërgua si kërkesë reale.

## Përfundim

U testuan faqja kryesore, detajet e projektit, rasti kur projekti nuk ekziston dhe simulimi i kërkesës për ofertë.

