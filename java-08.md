# Java 8 – Vendtakimi GPS

## Projekti
Ndërtimtari

## Qëllimi
Të mundësohet përcaktimi i vendtakimit për konsultim me ekipin e Ndërtimtarisë.

## Funksionalitetet
- Përdoruesi mund ta shkruajë vendtakimin manualisht.
- Përdoruesi mund ta konfirmojë vendtakimin.
- Përdoruesi mund të kërkojë vendndodhjen përmes GPS të pajisjes.
- Shfaqet saktësia e vendndodhjes kur GPS funksionon.
- Nëse përdoruesi refuzon lejen, shfaqet mesazhi përkatës.
- Nëse kërkesa për GPS tejkalon kohën, shfaqet mesazhi Timeout.

## Testimi
1. Vendtakimi manual – funksionon.
2. GPS me leje të dhënë – funksionon dhe shfaqet saktësia.
3. GPS me leje të refuzuar – shfaqet mesazhi përkatës.
4. GPS me Timeout – u testua me simulim dhe shfaqet mesazhi përkatës.

## Skedarët kryesorë
- aplikacioni/src/components/Vendtakimi.tsx
- aplikacioni/src/app/java-08-test/page.tsx
- aplikacioni/src/app/projekti/[id]/page.tsx
- aplikacioni/src/app/udhetimi/[id]/page.tsx

## Përfundimi
Funksionaliteti i vendtakimit është realizuar dhe testuar në aplikacionin Ndërtimtari.
