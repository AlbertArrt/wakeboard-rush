# WAKEBOARD RUSH 3D

Przeglądarkowa gra 3D (three.js r160) o wakeboardingu za wyciągiem linowym. Mobile‑first (Android, dotyk), działa też na desktopie (klawiatura/mysz). Grafika i dźwięki są generowane proceduralnie (Web Audio API), bez zewnętrznych assetów. **Gra działa w pełni offline** i można ją zainstalować jako aplikację (PWA). three.js jest dołączony lokalnie (`vendor/three.module.js`), bez CDN.

## Co nowego (wersja 2)

**Czucie jazdy i balans**
- **PERFECT LANDING** i duże triki: krótkie spowolnienie czasu (slow‑motion, można wyłączyć w SETTINGS), złoty błysk, wybuch cząsteczek, „kopnięcie” kamery (FOV) i wstrząs.
- Mocniejsze rozbryzgi i pióropusz wody, efekt prędkości przy dopalaczu.
- **Bufor wejścia**: triki wciśnięte jeszcze na rampie wykonują się w chwili wybicia (możesz zaplanować np. POP + 360 przed skocznią).
- **Okno łaski przy lądowaniu**: prawie domknięty obrót zalicza się jako „SKETCHY”/„SAVED IT!” zamiast wywrotki.
- **Pojedynczy swipe nigdy nie kończy biegu** – nieudany prosty trik = „BAILED” (bez punktów), wywrotka grozi tylko przy przesadzonym combo.
- Płynniejszy skręt (wygładzone sterowanie palcem i klawiaturą).
- **Mnożnik rośnie wolniej i znaczy więcej**: pasek XP pod mnożnikiem napełniają triki, PERFECT, grindy i mijanki o włos; po osiągnięciu limitu poziomu pokazuje „MAX”. Cele poziomów przeliczono pod nowy mnożnik.
- Łagodniejsza krzywa trudności (prędkość, gęstość przeszkód i czas reakcji rosną stopniowo przez 15 poziomów). Każdy poziom ma **stały, powtarzalny układ trasy** (seed) – dzięki temu można się go nauczyć i ścigać z duchem.

**Gwiazdki, misje, wyzwanie dnia**
- **3 gwiazdki na poziom**: ★ cel poziomu, ★ próg punktów, ★ misja poziomu. Widoczne w wyborze poziomu, w karcie lokacji, w menu i na ekranie ukończenia. Każda nowa gwiazdka = +10 💎. Po ukończeniu celu możesz wybrać **KEEP RIDING**, żeby dobić punkty do gwiazdki.
- **Misje** (menu → MISSIONS & DAILY): zawsze 3 aktywne, z puli 20; po wykonaniu dostajesz rubiny, a na miejsce wskakuje następna. Misję można wymienić za 10 💎.
- **Wyzwanie dnia**: generowane z daty (każdy gracz ma tego dnia to samo), na wskazanej lokacji, w jednym przejeździe. Nagroda rośnie z **serią dni (streak)** – 50 💎 + 10 za każdy kolejny dzień (maks. +70). Opuszczony dzień zeruje serię.

**Duch i power‑upy**
- **Duch najlepszego przejazdu** (półprzezroczysty, błękitny) dla każdego poziomu; w HUD widać przewagę/stratę w metrach. Wyłącznik: SETTINGS → GHOST.
- **Power‑upy** na trasie: 🧲 **MAGNES** (przyciąga rubiny), 🛡️ **TARCZA** (pochłania jedną wywrotkę), ⚡ **BOOST** (przyspieszenie, rozbija przeszkody), ✖2 **SCORE x2**. Każdy ma licznik czasu w HUD, własny efekt i dźwięk.
- Rzadkie **złote rubiny** (+5 💎 i bonus punktowy).

**Offline + PWA**
- `manifest.webmanifest`, ikony 192/512 (też „maskable”), orientacja pozioma, kolor motywu.
- Service worker (`sw.js`) zapisuje w pamięci podręcznej wszystkie pliki – po pierwszym uruchomieniu gra działa bez internetu.
- Przycisk **INSTALL APP · ZAINSTALUJ** w menu i w SETTINGS (pojawia się, gdy przeglądarka pozwala zainstalować grę).

Zapis jest **zgodny wstecz**: stare postępy (rubiny, garaż, odblokowania, rekordy) są automatycznie migrowane do nowego formatu, a za już pobite rekordy/cele od razu przyznawane są pasujące gwiazdki.

## Struktura

| Ścieżka | Opis |
|---|---|
| `index.html` | Gotowa gra (zbudowana) |
| `manifest.webmanifest` | Manifest PWA |
| `sw.js` | Service worker (offline) |
| `vendor/three.module.js` | three.js r160 (lokalnie, bez CDN) |
| `icons/` | Ikony aplikacji (generuje `tools/make_icons.py`, PIL) |
| `index.src.html` | Szablon HTML/CSS (znacznik `<!--GAME-->`) |
| `src/*.js` | Kod źródłowy (core, audio, świat, otoczenie, rider, obiekty, gra, meta: misje/gwiazdki/duch/PWA, UI) |
| `build.py` | Skleja `src/*.js` → `game.js` i wstawia do `index.html` |
| `tools/make_zip.py` | Pakuje pliki do publikacji → `wakeboard-rush-web.zip` |
| `tests/*.py` | Testy automatyczne (Playwright + headless Chromium) |
| `screenshots/` | Zrzuty ekranu |

**Do publikacji potrzebne są tylko:** `index.html`, `manifest.webmanifest`, `sw.js`, `vendor/`, `icons/` – dokładnie to zawiera `wakeboard-rush-web.zip` (pliki w katalogu głównym archiwum).

## Uruchomienie lokalnie

Moduły ES i service worker nie działają z `file://`, więc potrzebny jest prosty serwer:

```bash
cd wakeboard-rush
python3 -m http.server 8000
```

Otwórz `http://localhost:8000/` w Chrome/Firefox/Edge.

Po zmianach w `src/` lub `index.src.html`:

```bash
python3 build.py
cp game.js /tmp/game.mjs && node --check /tmp/game.mjs   # kontrola składni
python3 tools/make_zip.py                                # nowy ZIP do publikacji
```

**Ważne przy aktualizacjach:** service worker serwuje pliki z pamięci podręcznej („cache‑first”). Po każdej zmianie publikowanych plików podbij `VERSION` w `sw.js` (np. `wbr3d-v2.0.1`) – inaczej gracze mogą widzieć starą wersję. Nowa wersja wczytuje się po ponownym otwarciu gry.

## Sterowanie

**Dotyk (telefon):**
- przeciągnij palcem w lewo/prawo – skręt (rider podąża za palcem),
- przesunięcie w górę – skok (na rampie/kickerze = mocniejszy POP),
- w powietrzu: swipe w lewo/prawo = obrót (każdy swipe +180°), w górę = backflip, w dół = frontflip,
- swipe na rampie jest buforowany i wykona się przy wybiciu,
- opcjonalne przyciski trików na ekranie (SETTINGS), przycisk pauzy i wyciszenia w HUD.

**Klawiatura:**
- `A`/`D` lub `←`/`→` – skręt,
- `W` / `↑` / `Spacja` – skok,
- w powietrzu: `←`/`→` (lub `A`/`D`) obrót, `↑`/`W` backflip, `↓`/`S` frontflip,
- `P` / `Esc` – pauza (w menu `Esc` = powrót), `R` – szybki restart, `Enter` – graj / ponów, `M` – wycisz.

Zbyt ambitne combo (np. obrót + flip przy małym wyskoku) nadal grozi wywrotką – ale pojedynczy nieudany swipe kończy się tylko „BAILED”.

## Android: gra offline i instalacja (PWA)

**Instalacja wymaga HTTPS** (np. GitHub Pages / Netlify) **albo `localhost`.** Z adresu `http://192.168.x.x` (LAN) gra działa, ale Chrome nie pozwoli jej zainstalować i nie włączy trybu offline.

1. Opublikuj grę (patrz niżej) i otwórz link `https://…` w Chrome na telefonie.
2. Poczekaj chwilę, aż gra się wczyta (service worker zapisze pliki).
3. Stuknij **INSTALL APP · ZAINSTALUJ** w menu gry albo w Chrome: menu ⋮ → **„Zainstaluj aplikację”** / „Dodaj do ekranu głównego”.
4. Ikona WAKEBOARD RUSH pojawi się na ekranie głównym; gra uruchamia się na pełnym ekranie w poziomie.
5. Test offline: włącz tryb samolotowy i uruchom grę z ikony – działa w pełni (zapis postępu też, bo jest lokalny).

Przycisk instalacji pojawia się tylko wtedy, gdy przeglądarka zgłosi taką możliwość (Chrome/Edge na Androidzie i desktopie). Na iPhonie: Safari → Udostępnij → „Do ekranu początkowego”.

## Test na telefonie z Androidem (LAN, bez instalacji)

1. Komputer i telefon w **tej samej sieci Wi‑Fi**.
2. Na komputerze: `python3 -m http.server 8000 --bind 0.0.0.0`.
3. Sprawdź IP komputera (`ip addr` / `ipconfig`), np. `192.168.1.23`.
4. Na telefonie w Chrome otwórz `http://192.168.1.23:8000/`.
5. Jeśli nie działa – zezwól na port 8000 w zaporze (Windows Defender Firewall / `ufw allow 8000`).
6. Debugowanie: `chrome://inspect` na komputerze + debugowanie USB na telefonie (tam też można przekierować port: „Port forwarding” `8000 → localhost:8000`, wtedy na telefonie działa `http://localhost:8000/` razem z PWA).

## Publikacja

Publikuj **cały folder** (albo rozpakowany `wakeboard-rush-web.zip`): `index.html`, `manifest.webmanifest`, `sw.js`, `vendor/`, `icons/`. Sam `index.html` już nie wystarczy – three.js i ikony są w osobnych plikach.

**GitHub Pages** (HTTPS → instalacja PWA działa)
1. Utwórz repozytorium i wrzuć do katalogu głównego zawartość ZIP‑a (lub cały folder projektu).
2. Settings → Pages → Source: „Deploy from a branch”, gałąź `main`, folder `/ (root)`.
3. Po chwili gra jest pod `https://<login>.github.io/<repo>/`. Wszystkie ścieżki są względne, więc podkatalog repo nie przeszkadza.

**Netlify Drop** (HTTPS)
1. Rozpakuj `wakeboard-rush-web.zip`.
2. Wejdź na https://app.netlify.com/drop i przeciągnij rozpakowany folder – dostaniesz publiczny link HTTPS.

**itch.io**
1. Wgraj `wakeboard-rush-web.zip` (index.html jest w katalogu głównym archiwum).
2. Nowy projekt → Kind of project: **HTML** → zaznacz „This file will be played in the browser”.
3. Ustaw rozmiar okna (np. 960×540), włącz „Mobile friendly” i przycisk pełnego ekranu.
4. Na itch.io gra działa w ramce (iframe) – instalacja PWA i offline tam nie zadziałają; do instalacji użyj GitHub Pages/Netlify.

## Testy

Wymagania: Python 3, Playwright, Pillow, Chromium/Chrome.

```bash
pip install playwright pillow
python3 -m http.server 8765 &               # testy oczekują portu 8765
python3 tests/smoke.py      # ładowanie strony, brak błędów w konsoli
python3 tests/play.py       # bieg, skręt, skok + trik, wywrotka → ekran porażki → restart
python3 tests/features.py   # misje, gwiazdki, wyzwanie dnia + seria, migracja zapisu, duch, power-upy, slow-mo, bufor/okno łaski, przycisk instalacji
python3 tests/pwa.py        # manifest + ikony, service worker, gra offline (context.set_offline)
python3 tests/shots.py      # zrzuty ekranu 01–12 + mobile
python3 tests/shots2.py     # zrzuty ekranu 20–25 (misje, gwiazdki, duch, power-up, slow-mo, instalacja)
python3 tests/soak.py       # losowe sterowanie na wszystkich etapach
python3 tests/autopilot.py  # bot omijający przeszkody
python3 tests/persist.py    # garaż + zapis po przeładowaniu
python3 tests/calibrate.py  # bot z trikami na wszystkich 15 poziomach (kontrola balansu)
```

`tests/pwa.py` można też odpalić na rozpakowanym ZIP‑ie: `python3 tests/pwa.py http://localhost:8766/`.
Ścieżka przeglądarki w testach to `/usr/bin/google-chrome` (flagi SwiftShader dla trybu headless bez GPU) – zmień w `tests/common.py`, jeśli masz inną.

## Zapis

Postęp (rubiny, garaż, odblokowania, rekordy, gwiazdki, misje, wyzwanie dnia i seria, statystyki, ustawienia) jest w `localStorage` pod kluczem `wakeboardRush3D_save_v1` (format v2, automatyczna migracja z v1). Duchy przejazdów są w osobnym kluczu `wakeboardRush3D_ghosts_v1`. Wyczyszczenie danych strony resetuje postęp; RESET PROGRESS w SETTINGS czyści też duchy.
