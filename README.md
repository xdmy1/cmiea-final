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
- `content/events.json`: arhiva evenimentelor verificate, cu datele, afișele și sursele originale.
- `scripts/prepare-assets.mjs`: pregătește resursele, adaptoază inițializarea formularelor la React și generează redirecționările pentru URL-urile vechi, păstrând parametrii și ancorele.

Homepage-ul, listele de cursuri/evenimente/cluburi, noutățile, navigarea și panoul de navigare admin sunt componente React. Formularele de autentificare, înregistrare, înscriere și editare admin păstrează logica Firebase existentă, într-o zonă izolată de componentele React.

Pagina individuală de curs este afișată la `/curs/?id=...`, cu navigarea comună, lățime consecventă și logica de înscriere existentă. Fișierele sursă `curs.html` și `js/curs.js` sunt păstrate; adaptorul pregătește prezentarea pentru React. Pagina „Cursuri” păstrează structura inițială, cu corecturile cerute pentru carduri și șase cursuri pe pagină.

## Noutăți

Feedul social afișează o selecție de postări Facebook despre CMIEA. Linkurile originale sunt verificate prin republicările publice ale Preturii Rîșcani; fiecare postare își păstrează autorul real. Textele sunt rezumate editoriale, iar imaginile disponibile sunt păstrate local. Nu este o sincronizare automată a paginii Facebook CMIEA.

Selecția se află în `content/facebook-sources.json`. Comanda `npm run news:refresh` verifică și reimportă postările în `content/news.json`; buildul folosește datele locale.

## Administrarea conținutului

Secțiunea „Echipă și funcții” permite administratorilor existenți să actualizeze persoanele, ordinea lor, fotografiile prin URL și mesajul echipei. Conținutul este salvat în documentul Firestore `siteContent/team`; pagina Despre noi urmărește actualizările. Dacă documentul nu există, sunt folosite datele inițiale din `content/team.json`. Regula adăugată în proiect permite citirea publică și scrierea prin funcția existentă `isAdmin()`.

Formularele pentru cursuri, evenimente și cluburi păstrează câmpurile și salvarea Firebase, cu secțiuni clare și acțiuni vizibile permanent. Încărcarea fotografiilor din fișiere este amânată; sunt disponibile linkurile către imagini.

## Evenimente încheiate

Cele trei ediții inițiale din arhivă sunt documentate prin anunțurile publice DGETS, postarea Facebook a Preturii Rîșcani și retrospectivele Primăriei Chișinău. Fiecare pagină de detalii păstrează linkurile surselor. Afișele sunt salvate în `assets/events/`.

Arhiva din `content/events.json` se afișează alături de evenimentele Firebase, inclusiv când serviciul nu răspunde. Datele evenimentelor existente au prioritate, iar intrările identice nu se dublează. Paginile `/evenimente/arhiva/[slug]/` sunt exportate static și indică faptul că înscrierile sunt închise. Adăugarea arhivei nu scrie în baza Firebase; evenimentele administrate din panou rămân în Firebase.

## Publicare

Workflow-ul `Verify Next.js site` verifică testele, tipurile și buildul. Site-ul de producție folosește în continuare ramura `main` și domeniul `cmiea.md`.

Pentru preview-ul separat GitHub Pages:

```sh
npm run preview:build
npm run preview:publish
npm run prepare:assets
```

Preview-ul este construit pentru `/cmiea-preview`, fără CNAME. Scriptul publică exclusiv artefactul static într-un repository personal `cmiea-preview`, pe ramura `preview`, folosind autentificarea Git existentă. Nu publică sursele sau fișierele de mediu și nu schimbă setările Pages ale repository-ului original. După build, ultima comandă reface resursele pentru serverul local de la rădăcină.
