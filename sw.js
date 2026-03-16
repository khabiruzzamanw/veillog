const CACHE = "journix-v1";
const FILES = [
  "/journix/",
  "/journix/index.html",
  "/journix/style.css",
  "/journix/index.js",
  "/journix/manifest.json",
  "/journix/images/darkMode.svg",
  "/journix/images/menuLight.svg",
  "/journix/images/menuDark.svg",
  "/journix/images/addNoteLight.svg",
  "/journix/images/addNoteDark.svg",
  "/journix/images/searchLight.svg",
  "/journix/images/searchDark.svg",
  "/journix/images/dropDownLight.svg",
  "/journix/images/dropDownDark.svg",
  "/journix/images/daySelectionLight.svg",
  "/journix/images/daySelectionDark.svg",
  "/journix/images/categoryIconLight.svg",
  "/journix/images/categoryIconDark.svg",
  "/journix/images/emptyNoteLight.svg",
  "/journix/images/emptyNoteDark.svg",
  "/journix/images/editNoteLight.svg",
  "/journix/images/editNoteDark.svg",
  "/journix/images/deleteLight.svg",
  "/journix/images/deleteDark.svg",
  "/journix/images/lightMode.svg",
  "/journix/images/favicon.png"
];

// install → cache all files
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES))
  );
});

// fetch → serve from cache, fallback to network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});