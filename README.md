# OpenMeteo (OpenWeatherMap vežba)

Mala front-end aplikacija za pregled vremena po gradu i državi. Koristi **OpenWeatherMap** API (nije [Open-Meteo](https://open-meteo.com/)); naziv repozitorijuma je istorijski — funkcionalnost je vezana za OpenWeatherMap.

## Demo

- **Aplikacija:** [openmeteo.netlify.app](https://openmeteo.netlify.app)
- **Prijava (samo demonstracija, nije prava autentikacija):**
  - korisničko ime: `user`
  - lozinka: `1234`

## Funkcije

- prijava čuva sesiju u `sessionStorage`; odjava briše `localStorage` i `sessionStorage`
- izbor države (podaci sa [REST Countries](https://restcountries.com/)) i grada
- trenutno vreme preko [OpenWeatherMap Current Weather API](https://openweathermap.org/current)
- prikazi po tabovima: sat / dan / mesec (Nunjucks šabloni)
- svetla / tamna tema i jedinice °F / °C (imperial / metric)

## Tehnologije

HTML, CSS, [Bulma](https://bulma.io/), [jQuery](https://jquery.com/), [Nunjucks](https://mozilla.github.io/nunjucks/) (šabloni iz `templates/`), bez build alata.

## Lokalno pokretanje

1. Zatražite besplatan API ključ na [openweathermap.org](https://openweathermap.org/api) (ne commitujte ga u git).

2. Podesite `API_KEY` tako da ga `js/app2.js` vidi pre učitavanja skripte, npr.:
   - Netlify / drugi hosting: environment varijabla koja se mapira u klijentski kod po vašem setupu, ili
   - lokalno: mali wrapper HTML koji pre `app2.js` postavi `window.API_KEY = "..."` **samo za razvoj** (za produkciju bezbednije je proxy ili injekcija na buildu).

3. Pokrenite statički server iz korena repozitorijuma (Nunjucks učitava šablone preko mreže — `file://` obično ne radi kako treba):

   ```bash
   npx --yes serve .
   ```

   Zatim otvorite URL koji server ispiše (npr. `http://localhost:3000`).

Ako `API_KEY` nedostaje, aplikacija prikazuje upozorenje pre poziva API-ja.

## Struktura

| Putanja | Sadržaj |
|--------|---------|
| `index.html` | Ulaz, CDN zavisnosti, `#app` |
| `js/app2.js` | Login, API pozivi, UI događaji |
| `js/components/Countries.js` | Model države iz REST Countries |
| `css/style.css` | Tema i stilovi |
| `templates/*.njk` | Nunjucks šabloni (login, vreme, tabovi) |

## Napomene

- Login je namerno pojednostavljen na klijentu (bez backend-a).
- Spoljni API-jevi podležu limitima i uslovima korišćenja njihovih provajdera.
