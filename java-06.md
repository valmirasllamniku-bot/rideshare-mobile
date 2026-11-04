\# Java 6 – PWA (Progressive Web App)



\## Projekti: Ndërtimtari



\### 1. Përshkrimi

Ndërtimtari është një aplikacion për prezantimin e projekteve ndërtimore dhe kërkesave për oferta. Aplikacioni është përshtatur si Progressive Web App (PWA), duke mundësuar instalimin në pajisje dhe përdorimin edhe pa lidhje interneti.



\### 2. Manifesti

Është krijuar skedari `src/app/manifest.ts`, i cili përmban:

\- Emrin e aplikacionit: Ndërtimtari.

\- Gjuhën shqipe.

\- Modalitetin `standalone`.

\- Ngjyrën e temës.

\- Ikonat 192x192 dhe 512x512.



\### 3. Service Worker

Është krijuar skedari `public/sw.js`, i cili:

\- Regjistron dhe menaxhon cache.

\- Ruajt përgjigjet e API-së `/api/projektet`.

\- Mundëson shfaqjen e të dhënave të ruajtura kur nuk ka internet.

\- Shfaq faqen offline kur lidhja me internetin mungon.



\### 4. Instalimi dhe regjistrimi

Service Worker regjistrohet përmes komponentit `src/components/Pwa.tsx`, i cili thirret në `src/app/layout.tsx`.



\### 5. Ruajtja lokale

Projektet ruhen në `localStorage` me çelësin `ndertimtari-projektet`, në mënyrë që të mund të shfaqen edhe pa internet.



\### 6. Testimi

Janë realizuar kontrollet:

\- Build i aplikacionit përfundoi me sukses.

\- Manifesti u hap në shfletues.

\- Ikonat 192x192 dhe 512x512 u verifikuan.

\- Service Worker u aktivizua me sukses.

\- Aplikacioni u testua në modalitetin Offline.

\- API `/api/udhetimet` ktheu tri projekte nga databaza.



\### 7. Përfundimi

Aplikacioni Ndërtimtari është përshtatur si PWA dhe mbështet ruajtjen lokale të të dhënave dhe përdorimin bazë offline.

