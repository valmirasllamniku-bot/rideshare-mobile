# Java 6 – PWA (Progressive Web App)

## Projekti: Ndërtimtari

### 1. Përshkrimi
Ndërtimtari është aplikacion për prezantimin e projekteve ndërtimore dhe kërkesave për oferta. Aplikacioni është përshtatur si Progressive Web App (PWA), duke mundësuar përdorimin edhe pa lidhje interneti.

### 2. Manifesti dhe ikonat
Është krijuar skedari `src/app/manifest.ts`, i cili përmban:
- Emrin: Ndërtimtari.
- Gjuhën: Shqip.
- Modalitetin: `standalone`.
- Ngjyrën e temës.
- Ikonën `icon-192.png`.
- Ikonën `icon-512.png`.

### 3. Service Worker
Është krijuar skedari `public/sw.js`, i cili:
- Regjistron cache për aplikacionin.
- Ruajnë përgjigjet e API-së `/api/udhetimet` dhe `/api/projektet`.
- Ruajnë kohën e fundit të marrjes së të dhënave.
- Mundëson leximin e projekteve pa internet.
- Përdor faqen `offline.html` kur mungon lidhja me internetin.

### 4. Regjistrimi i Service Worker
Service Worker regjistrohet përmes komponentit `src/components/Pwa.tsx`, i cili thirret në `src/app/layout.tsx`.

### 5. Ruajtja lokale
Projektet ruhen edhe në `localStorage` me çelësin `ndertimtari-projektet`. Service Worker ruan përgjigjet e API-së në Cache Storage.

### 6. Provat dhe rezultatet

**Prova 1 – Marrja e projekteve online**

Hapat:
1. Hapet aplikacioni me internet.
2. Hapet faqja `/offline.html`.
3. Kontrollohen tri projektet dhe koha e ruajtjes.

Pritja: Projektet të merren nga serveri dhe të ruhet koha e marrjes.

Rezultati: Kaloi. Tri projektet u shfaqën dhe koha e ruajtjes u regjistrua.

**Prova 2 – Përdorimi offline**

Hapat:
1. Në Chrome hapet DevTools.
2. Te Network aktivizohet Offline.
3. Rifreskohet faqja `/offline.html`.

Pritja: Projektet të lexohen nga kopja e ruajtur.

Rezultati: Kaloi. Tri projektet u shfaqën edhe pa internet dhe koha e ruajtjes mbeti e njëjtë.

**Prova 3 – Rikthimi i internetit**

Hapat:
1. Në Network çaktivizohet Offline.
2. Aktivizohet No throttling.
3. Rifreskohet lista me butonin Rifresko listën.

Pritja: Projektet të merren përsëri nga serveri dhe koha të përditësohet.

Rezultati: Kaloi. Projektet u morën nga serveri dhe koha e ruajtjes u përditësua.

### 7. Testimi teknik
- `npm run build` përfundoi me sukses.
- Manifesti u hap dhe u verifikua.
- Ikonat 192x192 dhe 512x512 u verifikuan.
- Service Worker u aktivizua me sukses.
- API `/api/udhetimet` ktheu tri projektet nga databaza.
- Tri provat online dhe offline përfunduan me sukses.

### 8. Përfundimi
Aplikacioni Ndërtimtari është përshtatur si PWA. Ai mundëson marrjen e projekteve nga serveri, ruajtjen e tyre në cache dhe shfaqjen e tyre pa internet. Pas rikthimit të internetit, lista mund të rifreskohet nga serveri.