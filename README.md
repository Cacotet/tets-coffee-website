# Tet’s Coffee — website

A static one-page site for Tet’s Coffee (Kohima). No build step, no framework,
no admin UI — just HTML, CSS, JavaScript and image files. Edit the code directly.

## Files

```
index.html      Page content
css/styles.css  All styling (colours, fonts, layout)
js/main.js      Roast slider, menu tabs, WhatsApp pre-order dialog
js/visitor-counter.js  Shared visitor count stored in Firestore
assets/         Images (logo + 4 product photos)
tetsweb.original.html   Untouched original single-file version (backup)
```

## Preview it

Open `index.html` in a browser, or serve the folder with either:

```sh
npm run dev
# or
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. A local server is only needed if you later
add things browsers restrict on `file://`; the page works when opened directly too.

## Where to edit what

### Brand, title and description

- `index.html` → `<title>`, `<meta name="description">`, the hero `<h1>`, and the
  footer line.
- `js/main.js` → `SITE.name` (used in the WhatsApp message).

### Hero and story text

- `index.html` → the `<header class="hero">` section and the `<section id="story">`.
  The hero uses `assets/top-header.jpg` as a single top row of four copies
  stitched side by side; it is set in `css/styles.css` under `.hero`
  (`background-image` / `background-size: 25% auto` / `repeat-x`).
- The roast slider labels and notes live in the `S` array at the top of
  `js/main.js`. Each entry is `name`, background colour `c`, text colour `t`,
  temperature label `d`, and description `x`.

### Café menu

- `index.html` → `<section id="menu">`.
- Two tabs: **Hot** (`data-t="m1"`) and **Cold** (`data-t="m2"`), each matched to
  a `<ul class="menu" id="m1">` / `id="m2"` list. Add a tab by adding a button and
  a matching list. Add `class="on"` to the list that should show first.
- Each item is one `<li>`: the name and price sit in `<div class="mi">`, and the
  description follows. Prices are plain text (`₹80`), so change them directly.

### Limited-time special

- Below the menu lists there is a `.special` card. It currently features the
  **Pumpkin spice latte (₹150)** with the photo `assets/pumpkin.jpg`. Change the
  heading, the `.special-price` line and the description when the special
  changes.
- To use a different photo, replace `assets/pumpkin.jpg` (keep the same name) or
  update the `<img src="...">` inside `.special-media`. The photo is shown at
  its natural proportions, scaled down to fit the card (about 380 px tall on
  desktop, 240 px on phones).
- Remove the whole `<aside class="special">` block if you do not want the card
  at all.

### Products, prices and brew steps

- `index.html` → `<section id="beans">` (products, roast chips, pack prices) and
  `<section id="brew">` (four steps and specs).
- Pack sizes in the pre-order dialog are set by `SIZES` in `js/main.js`:
  whole beans start at 200 g (₹300), ground coffee at 250 g (₹400).

### Contact details and map

- `index.html` → `<section id="visit">` for address, email, Instagram and FSSAI.
  The street address also appears next to the “The café” menu heading in the
  small `.cafe-address` line.
- The footer also contains the FSSAI number and the visitor count. The count is
  shown in `#visitor-count` and is incremented once per browser by
  `js/visitor-counter.js`.
- The “Get directions” link and the map’s “Open in Google Maps” button both use
  the café’s Google Maps link. The map itself is a custom Leaflet map with a
  coffee-cup marker (on a white circular badge) and a “Tet’s Coffee” label. It
  opens in satellite view and
  has a “Street map” / “Satellite” switch. Scroll the mouse wheel over the map
  to zoom in and out. It needs no API key.
- To move the map, update the `cafe` coordinates near the bottom of
  `js/main.js` (`[25.6612473, 94.1000902]`). Leaflet’s CSS and JS are loaded
  from unpkg in `index.html`; the map needs an internet connection to show
  tiles.

### WhatsApp number

Edit **only** `js/main.js`:

```js
const SITE = {
  name: "Tet’s Coffee",
  whatsapp: "917005315103", // country code + number, digits only
  whatsappDisplay: "+91 70053 15103",
};
```

`whatsapp` is used to build the `wa.me` link; `whatsappDisplay` is written into
the visit section automatically. Change both together.

### Images

Replace the files in `assets/`, keeping the same file names:

| File | Used for |
| --- | --- |
| `logo.png` | Favicon, nav logo, footer logo |
| `top-header.jpg` | Full-width background banner at the very top of the page |
| `beans-bag.jpg` | Beans & grounds product card |
| `easy-pour.jpg` | Easy pour product card |
| `easy-pour-back.jpg` | Brew guide photo |
| `beans-bag-back.jpg` | “Know what’s in your bag” photo |
| `pumpkin.jpg` | Limited-time special (Pumpkin spice latte) |

If you use different names or formats, update the matching `src="..."` in
`index.html`. Keep photos reasonably sized (roughly 700–1000 px wide) so the page
stays fast.

### Colours and fonts

- `css/styles.css` → the `:root` block at the top holds the palette:
  `--paper`, `--ink`, `--mute`, `--red`, `--card`, `--line`. The hero background
  and text colours are driven by the slider via `--bg` / `--fg`.
- Dark mode colours are in the `prefers-color-scheme: dark` and
  `[data-theme="dark"]` rules just below.
- Fonts are loaded from Google Fonts in `index.html` (`Bricolage Grotesque` and
  `Newsreader`). Change the `<link>` and the `font-family` rules in
  `css/styles.css` to swap them.

## Visitor count setup

The page is still static, but the visitor count is stored in the
`tet-s-coffee-roastery` Firebase project's Firestore database. In Firebase
console → **Firestore Database → Rules**, add this rule alongside the existing
rules (do not remove rules for other collections):

```js
match /siteVisits/tetsweb {
  allow get: if true;
  allow create: if request.resource.data.keys().hasOnly(["count", "updatedAt"])
    && request.resource.data.count is int
    && request.resource.data.count == 1
    && request.resource.data.updatedAt == request.time;
  allow update: if request.resource.data.keys().hasOnly(["count", "updatedAt"])
    && request.resource.data.count is int
    && request.resource.data.count == resource.data.count + 1
    && request.resource.data.updatedAt == request.time;
}
```

The counter doc is `/siteVisits/tetsweb`, with an integer `count` field. The
script increments it only once per browser (tracked in `localStorage`), so
reloads and repeat visits do not add to the total. Until the rule is published,
the footer shows `Visitors: Unavailable`.

## Notes

- Apart from the Firestore-backed visitor count, the page is static. Pre-orders
  open WhatsApp with a pre-filled message.
- The page is responsive and follows the visitor’s light/dark preference.
- When you are ready to publish, upload `index.html`, `css/`, `js/` and `assets/`
  to any static host (Netlify, Cloudflare Pages, GitHub Pages, or your own
  hosting). `tetsweb.original.html` and this README do not need to be uploaded.
