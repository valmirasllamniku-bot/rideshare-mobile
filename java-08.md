# Java 8 – Vendtakimi GPS

## Projekti
Ndërtimtari

## Qëllimi
Të mundësohet përcaktimi i vendtakimit për konsultim me ekipin e Ndërtimtarisë, duke ofruar edhe përdorimin e GPS-it.

### Prova 1 – Kërkesa për leje dhe pranimi

**Hapat:**
1. Hapet faqja `/java-08-test`.
2. Kontrollohet që hapja e faqes nuk kërkon menjëherë leje për vendndodhje.
3. Klikohet butoni "Përdor vendndodhjen time".
4. Në kërkesën e shfletuesit pranohet leja për vendndodhje.

**Pritshmëria:** Faqja hapet pa kërkuar leje. Leja kërkohet vetëm pasi përdoruesi klikon butonin GPS. Pas pranimit, aplikacioni merr vendndodhjen dhe shfaq saktësinë.

**Çfarë pashë realisht:** Faqja u hap pa kërkesë për leje. Pas klikimit në butonin GPS dhe pranimit të lejes, u shfaq mesazhi "Pozicioni u mor." dhe saktësia e vendndodhjes.

### Prova 2 – Refuzimi dhe përfundimi i pritjes

**Hapat:**
1. Refuzohet leja e vendndodhjes në shfletues.
2. Klikohet butoni "Përdor vendndodhjen time".
3. Kontrollohet mesazhi i refuzimit.
4. Shkruhet një vendtakim manual në fushën përkatëse.
5. Klikohet "Konfirmo vendtakimin".
6. Simulohet përfundimi i kohës së pritjes për GPS.

**Pritshmëria:** Pas refuzimit shfaqet mesazh që udhëzon përdoruesin të shkruajë vendtakimin manualisht. Vendtakimi manual mund të konfirmohet. Në rast të përfundimit të kohës së pritjes, shfaqet mesazhi Timeout.

**Çfarë pashë realisht:** Pas refuzimit u shfaq mesazhi "Leja u refuzua. Shkruaj vendtakimin vetë." Vendtakimi manual u konfirmua. Me simulimin e gabimit Timeout u shfaq mesazhi "Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë."

### Prova 3 – Privatësia e të dhënave

**Hapat:**
1. Kontrollohet komponenti `Vendtakimi.tsx`.
2. Kontrollohet çfarë shfaqet në ndërfaqe pas marrjes së vendndodhjes.
3. Kontrollohet raporti dhe dëshmitë që publikohen në GitHub.
4. Kontrollohet që nuk janë vendosur sekrete ose koordinata reale në raport.

**Pritshmëria:** Dëshmitë e publikuara nuk duhet të përmbajnë koordinata reale, adresë private ose sekrete. Aplikacioni shfaq vetëm informacionin e nevojshëm për funksionimin e provës.

**Çfarë pashë realisht:** Në ndërfaqe shfaqet statusi i marrjes së vendndodhjes dhe saktësia në metra, jo koordinatat. Në raport përdoren të dhëna shembull dhe nuk përfshihen sekrete apo koordinata reale.

### Prova me një hyrje të re

**Hyrja që provova:** Prishtinë, lagjja Dardania – hyrja B.

**Parashikimi im para klikimit:** Pritja ime ishte që aplikacioni ta konfirmojë vendtakimin e shkruar.

**Çfarë pashë realisht:** Pas klikimit në butonin Konfirmo vendtakimin, aplikacioni shfaqi vendtakimin e shkruar si të konfirmuar.

**Skedari dhe funksioni që e shpjegojnë:** `aplikacioni/src/components/Vendtakimi.tsx` – funksionet `konfirmoVendtakimin()` dhe `kerkoVendndodhjen()`.

**Çfarë kuptova ose korrigjova:** Kuptova se përdoruesi mund ta përcaktojë vendtakimin manualisht edhe pa përdorur GPS.

## Skedarët kryesorë
- aplikacioni/src/components/Vendtakimi.tsx
- aplikacioni/src/app/java-08-test/page.tsx
- aplikacioni/src/app/projekti/[id]/page.tsx
- aplikacioni/src/app/udhetimi/[id]/page.tsx

## Përfundimi
Funksionaliteti i vendtakimit është integruar në projektin Ndërtimtari. Janë testuar vendtakimi manual, marrja e vendndodhjes, refuzimi i lejes dhe përfundimi i kohës së pritjes.


### Prova me një hyrje të re

**Hyrja që provova:** Prishtinë, lagjja Dardania – hyrja B.

**Parashikimi im para klikimit:** Parashikova që pas klikimit në butonin "Konfirmo vendtakimin", aplikacioni do ta ruajë dhe shfaqë hyrjen e re si vendtakim të konfirmuar.

**Çfarë pashë realisht:** Shkrova "Prishtinë, lagjja Dardania – hyrja B" në fushën e vendtakimit dhe klikova "Konfirmo vendtakimin". Aplikacioni shfaqi vendtakimin e konfirmuar me tekstin që shkrova.

**Skedari dhe funksioni që e shpjegojnë:** `aplikacioni/src/components/Vendtakimi.tsx`, funksioni `konfirmoVendtakimin()`, i cili kontrollon tekstin e shkruar dhe e vendos si vendtakim të konfirmuar.

**Çfarë kuptova ose korrigjova:** Kuptova se përdoruesi mund të vendosë një hyrje të re manualisht dhe të konfirmojë vendtakimin pa pasur nevojë për GPS.
