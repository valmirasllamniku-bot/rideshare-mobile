# RideShare – Java 7

## Rasti im

GitHub: valmirasllamniku-bot

Kodi: P7-634

Skenari i zgjedhur: Rasti 1 – Lista dhe detajet.

ID i projektit në aplikacionin tim: 1.

Të dhënat fiktive të rastit: Gjakovë → AAB, 08:20, 2 vende. Ora për provën e re: 08:25.

## Parashikimi

Para kodimit prisja që lista të shfaqte projektet e regjistruara në databazë. Kur të hapja një projekt, prisja të shfaqeshin detajet e tij. Kur të përdorja një ID që nuk ekziston, prisja të shfaqej mesazhi se projekti nuk u gjet.

## Ndryshimi i ri

Në projektin tim shtova dhe përmirësova formularin për kërkesë oferte. Formulari mundëson plotësimin e emrit, email-it, telefonit dhe përshkrimit të kërkesës.

## Ndihma nga AI

Kam përdorur ChatGPT për shpjegimin e kodit, krijimin dhe përmirësimin e formularit të kërkesës dhe rregullimin e Service Worker. Kodin e vendosa në projekt dhe i testova vetë faqet, API-në, formularin dhe ruajtjen e të dhënave në Local Storage.

## Dy probleme

1. Kur hapa faqen e kërkesës për ofertë, fillimisht shfaqej vetëm një tekst informues dhe nuk kishte formular funksional.
2. Në faqen e detajeve të projektit mungonte lidhja e drejtpërdrejtë për hapjen e formularit me tekstin "Kërko ofertë".

## Korrigjimi (arsyeja)

Skedari: `aplikacioni/src/app/projekti/[id]/kerkesa/page.tsx`

Ky skedar përmban formularin për kërkesë oferte. E përmirësova duke shtuar fushat për emër, email, telefon dhe përshkrim. Kërkesa ruhet në Local Storage me çelësin `ndertimtari-kerkesat`. Shtova edhe verifikimin e ruajtjes dhe mesazhin për sukses ose gabim.

Gjithashtu, shtova lidhjen "Kërko ofertë" në faqen e detajeve dhe përmirësova Service Worker për ruajtjen e faqeve dhe burimeve në cache.

## Prova 1

Hapat: Hapa adresën `http://localhost:3000/projekti/1`.

Pritshmëria: Të shfaqeshin detajet e projektit me ID 1.

Vëzhgimi: U shfaqën detajet e projektit "Ndërtim shtëpie". Prova kaloi.

## Prova 2

Hapat: Hapa adresën `http://localhost:3000/projekti/99`.

Pritshmëria: Të shfaqej mesazhi se projekti nuk ekziston.

Vëzhgimi: U shfaqën mesazhet "Projekti nuk u gjet" dhe "Ky projekt nuk ekziston". Prova kaloi.

## Prova 3

Hapat: Hapa adresën `http://localhost:3000/api/udhetimet`.

Pritshmëria: API-ja të kthente projektet e regjistruara në databazë.

Vëzhgimi: API-ja ktheu tri projektet e regjistruara. Prova kaloi.

### Prova shtesë – Formulari

Hapat: Hapa formularin e kërkesës, plotësova fushat dhe shtypa "Dërgo kërkesën".

Pritshmëria: Kërkesa të ruhej dhe të shfaqej mesazhi i suksesit.

Vëzhgimi: Kërkesa u ruajt me sukses në Local Storage dhe u verifikua përmes Chrome DevTools.

### Prova offline

Hapat: Aktivizova Offline në Chrome DevTools dhe hapa faqen e formularit.

Pritshmëria: Faqja e ruajtur të hapej pa internet.

Vëzhgimi: Formulari u hap offline. Dërgimi i një kërkese të re offline nuk u verifikua me sukses.
