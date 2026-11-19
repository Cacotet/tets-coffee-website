// Business details — change these here and they update everywhere.
const SITE = {
  name: "Tet’s Coffee",
  whatsapp: "917005315103", // country code + number, digits only
  whatsappDisplay: "+91 70053 15103",
};

// Pack sizes offered in the pre-order dialog.
const SIZES = {
  beans: ["200 g", "500 g", "1 kg"],
  grounds: ["250 g", "500 g", "1 kg"],
};

const S = [
  {
    n: "Green",
    c: "#8c9a5b",
    t: "#1d1a10",
    d: "Room temp",
    x: "Grassy and raw. Nothing you’d want to drink yet.",
  },
  {
    n: "Yellow",
    c: "#cdb458",
    t: "#2a2108",
    d: "About 160°C",
    x: "Hay and warm toast. The roaster is waking up.",
  },
  {
    n: "Light",
    c: "#b5793f",
    t: "#24140a",
    d: "First crack, about 196°C",
    x: "Bright, floral, tea-like. Every origin shows its character.",
  },
  {
    n: "Medium",
    c: "#7a4425",
    t: "#fbeede",
    d: "About 210°C",
    x: "Caramel and cocoa. Balanced, our everyday cup.",
  },
  {
    n: "Dark",
    c: "#2b170f",
    t: "#f2dfd0",
    d: "Second crack, 225°C and up",
    x: "Smoky, bittersweet, heavy body. Made for milk.",
  },
];
const $ = (id) => document.getElementById(id),
  R = document.documentElement,
  sl = $("roast");
$("wa-num").textContent = SITE.whatsappDisplay;
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const hex = (a) => "rgb(" + a.join(",") + ")";
$("ticks").innerHTML = S.map(
  (s, i) => '<button data-i="' + i + '">' + s.n + "</button>",
).join("");
function paint() {
  const v = +sl.value,
    i = Math.min(3, Math.floor(v)),
    k = v - i;
  const bg = mix(rgb(S[i].c), rgb(S[i + 1].c), k),
    fg = mix(rgb(S[i].t), rgb(S[i + 1].t), k);
  R.style.setProperty("--bg", hex(bg));
  R.style.setProperty("--fg", hex(fg));
  R.style.setProperty("--bean", hex(bg.map((x) => Math.round(x * 0.78))));
  R.style.setProperty("--rot", -24 + v * 12 + "deg");
  const n = Math.round(v),
    s = S[n];
  $("rname").textContent = s.n;
  $("rtemp").textContent = s.d;
  $("rnote").textContent = s.x;
  document
    .querySelectorAll("#ticks button")
    .forEach((b, j) => b.setAttribute("aria-current", j === n));
}
sl.addEventListener("input", paint);
$("ticks").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) {
    sl.value = b.dataset.i;
    paint();
  }
});
document.querySelectorAll(".tabs button").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".tabs button")
      .forEach((x) => x.setAttribute("aria-selected", x === b));
    document
      .querySelectorAll(".menu")
      .forEach((m) => m.classList.toggle("on", m.id === b.dataset.t));
  }),
);
paint();
const dl = $("order"),
  op = $("op"),
  orr = $("or"),
  os = $("os"),
  oq = $("oq"),
  on = $("on");
function setSizes() {
  const list = SIZES[op.value] || SIZES.beans;
  os.innerHTML = list.map((s) => "<option>" + s + "</option>").join("");
}
setSizes();
function msg() {
  const p = op.value;
  let t =
    "Hi " +
    SITE.name +
    "! I’d like to make a pre-order for " +
    {
      beans: "coffee beans",
      grounds: "coffee grounds",
      easy: "easy pour filter coffee",
    }[p] +
    ".";
  t +=
    p === "easy"
      ? " Quantity: " + (oq.value || 1) + " sachets."
      : " Roast: " + orr.value + ". Size: " + os.value + ".";
  if (on.value.trim()) t += " Name: " + on.value.trim() + ".";
  return t;
}
function upd() {
  const e = op.value === "easy";
  $("bg").hidden = e;
  $("eg").hidden = !e;
  const m = msg();
  $("pv").textContent = m;
  $("go").href =
    "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(m);
}
[op, orr, os, oq, on].forEach((x) => x.addEventListener("input", upd));
op.addEventListener("change", () => {
  setSizes();
  upd();
});
document.querySelectorAll("[data-p],[data-open]").forEach((b) =>
  b.addEventListener("click", () => {
    op.value = b.dataset.p || "beans";
    setSizes();
    upd();
    dl.showModal();
  }),
);
$("cx").addEventListener("click", () => dl.close());
$("go").addEventListener("click", () => setTimeout(() => dl.close(), 300));
dl.addEventListener("click", (e) => {
  if (e.target === dl) dl.close();
});

// Café map: Leaflet with a custom coffee-cup marker.
const mapEl = $("cafe-map");
if (mapEl) {
  if (window.L) {
    const cafe = [25.6612473, 94.1000902];
    const map = L.map(mapEl, {
      center: cafe,
      zoom: 17,
      scrollWheelZoom: true,
    });
    const streets = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: "map-tiles-street",
      },
    );
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        maxZoom: 19,
        maxNativeZoom: 18,
      },
    );
    satellite.addTo(map);
    L.control
      .layers({ "Street map": streets, Satellite: satellite }, null, {
        position: "bottomleft",
        collapsed: false,
      })
      .addTo(map);
    const cupIcon = L.divIcon({
      className: "cup-marker",
      html:
        '<span class="cup-label">Tet’s Coffee</span>' +
        '<span class="cup-badge">' +
        '<svg class="cup-icon" viewBox="0 0 64 64" aria-hidden="true">' +
        '<path d="M12 24h32v14a16 16 0 0 1-16 16 16 16 0 0 1-16-16V24Z" fill="#7a4425"/>' +
        '<path d="M44 28h4a9 9 0 0 1 0 18h-4" fill="none" stroke="#7a4425" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M22 16c0-3 3-4 3-7M32 16c0-3 3-4 3-7" fill="none" stroke="#7a4425" stroke-width="3" stroke-linecap="round" opacity=".75"/>' +
        '<ellipse cx="28" cy="58" rx="20" ry="4" fill="#2b170f" opacity=".16"/>' +
        "</svg>" +
        "</span>",
      iconSize: [160, 96],
      iconAnchor: [80, 94],
    });
    L.marker(cafe, {
      icon: cupIcon,
      title: "Tet’s Coffee",
      alt: "Tet’s Coffee",
    }).addTo(map);
  } else {
    mapEl.innerHTML =
      '<p class="map-fallback">The map could not load. <a href="https://maps.app.goo.gl/HUnMFsKrtgRWkJ8u5" target="_blank" rel="noopener">Open it in Google Maps</a>.</p>';
  }
}
