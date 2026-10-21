# CMIEA

Next.js App Router, React și TypeScript, cu export static compatibil cu GitHub Pages. Datele și înscrierile folosesc proiectul Firebase existent.

## Pornire locală

Node.js 24 este recomandat.

```sh
npm ci
npm run dev
```

Previzualizare: http://localhost:4173/home/.

```sh
npm test
npm run check
npm run build
```

`npm run build` generează site-ul în `out/`. Pentru publicare se servește acest director, nu fișierele HTML originale de la rădăcina repository-ului. Domeniul este păstrat în `out/CNAME`.

## Structură

- `app/`: rutele Next.js și stilurile aplicației.
- `components/`: navigare, temă, autentificare, carduri, paginare, recenzii, noutăți și navigarea adminului.
- `lib/`: clientul Firebase, filtrarea cursurilor și adaptorul pentru formularele existente.
- `content/news.json`: anunțuri selectate, cu data, imaginea și sursa fiecăruia.
- `scripts/prepare-assets.mjs`: pregătește resursele, adaptoază inițializarea formularelor la React și generează redirecționările pentru URL-urile vechi, păstrând parametrii și ancorele.

Homepage-ul, listele de cursuri/evenimente/cluburi, noutățile, navigarea și panoul de navigare admin sunt componente React. Formularele de autentificare, înregistrare, înscriere și editare admin păstrează logica Firebase existentă, într-o zonă izolată de componentele React.

Pagina individuală de curs este servită integral la `/curs/?id=...`. Fișierele originale `curs.html` și `js/curs.js` sunt păstrate nemodificate. Pagina „Cursuri” păstrează structura inițială, cu corecturile cerute pentru carduri și șase cursuri pe pagină.

## Noutăți

Încorporarea publică a paginii Facebook a returnat numai antetul, fără postări. Noutățile inițiale sunt anunțuri publice CMIEA republicate pe canalul oficial al Primăriei Chișinău; sursa este indicată pe fiecare card. Nu sunt prezentate ca un feed Facebook automat.

Pentru alte postări selectate, se pot adăuga în `content/news.json` titlul, rezumatul, imaginea, data, linkul original și numele sursei. Nu este necesar acces administrativ la Facebook pentru a publica aceste carduri în site. Imaginile se păstrează în `assets/news/`.

```sh
npm run news:refresh
```

Comanda de mai sus reimportă selecția explicită din `scripts/import-public-news.mjs`. Build-ul obișnuit folosește fișierele locale și nu depinde de disponibilitatea rețelelor sociale.

## Publicare

Workflow-ul `Verify Next.js site` verifică testele, tipurile și build-ul. Nu publică site-ul. Pentru GitHub Pages, directorul `out/` trebuie publicat printr-un workflow de deployment sau printr-o ramură de publicare; simpla publicare a surselor Next.js nu execută aplicația.
