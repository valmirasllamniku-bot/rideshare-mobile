# Java 11 — Njoftimet dhe angazhimi

## Përshtatja për Ndërtimtarinë

Kur administratori i përgjigjet kërkesës së klientit, aplikacioni ruan një njoftim personal. Klienti e sheh te `/panel`, pa rifreskim manual, dhe mund ta hapë kërkesën e saktë.

## Çfarë u ndërtua

- Njoftimet ruhen në Neon dhe lidhen me profilin e klientit dhe ID-në e kërkesës.
- Pranimi ose refuzimi i kërkesës dhe krijimi i njoftimit kryhen në të njëjtën komandë atomike të databazës.
- Një kërkesë mund të krijojë vetëm një njoftim përgjigjeje.
- Lista dhe numri i palexuar rifreskohen çdo 5 sekonda. Toast-i shfaqet vetëm për ID të re; lista mbetet pasi toast-i mbyllet.
- Kur klienti hap njoftimin, serveri kontrollon marrësin dhe kërkesën. Vetëm pas përgjigjes së suksesshme shënohet si e lexuar.
- Nuk u konfigurua Web Push; për ushtrimin përdoret njoftimi brenda aplikacionit dhe polling-u ekzistues.

## Skema

Migrimi `aplikacioni/schema-java11.sql` krijon tabelën e njoftimeve në Neon. Statusi `refuzuar` i Javës 10 përcaktohet te `aplikacioni/schema-refuzimi-kerkesave.sql`. Tabela përdor foreign keys, një kufizim unik për kërkesën dhe indeks për historikun personal.

## Provat manuale

Këto prova kërkojnë një sesion klienti dhe një sesion admini. Plotëso rezultatet pasi t’i provosh:

1. **Pranim:** dërgo kërkesë në pritje, pranoje si admin dhe verifiko një njoftim të palexuar te klienti; hapja duhet ta lidhë me kërkesën e saktë.
2. **Refuzim:** refuzo një kërkesë në pritje dhe verifiko statusin e refuzuar dhe njoftimin te klienti.
3. **Leximi:** hape njoftimin, verifiko që numri i palexuar ulet pas konfirmimit nga serveri dhe që historia mbetet pas rifreskimit.
4. **Pa dyfishim:** lëre polling-un të bëjë disa lexime; ID-ja dhe rekordi i njoftimit duhet të mbeten të njëjtë.
5. **Rilidhja:** vendose vetëm sesionin e klientit offline, përgjigju si admin, pastaj ktheje klientin online; njoftimi duhet të shfaqet një herë.
6. **Privatësia:** provo që një klient tjetër nuk mund t’i lexojë ose shënojë si të lexuara njoftimet e këtij klienti.

Provat me dy profile nuk janë kryer këtu; llogaria e disponueshme është përdorur si admin.