/* تخزين الدليل للعمل دون اتصال */
var CACHE = "mq24-v1";
var FILES = [
  "./", "index.html", "data.js", "manifest.webmanifest",
  "img/logo.jpg", "img/icon-180.png", "img/icon-192.png",
  "fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2",
  "fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2",
  "fonts/ibm-plex-sans-arabic-latin-500-normal.woff2",
  "fonts/ibm-plex-sans-arabic-latin-700-normal.woff2",
  "fonts/noto-naskh-arabic-arabic-500-normal.woff2",
  "fonts/noto-naskh-arabic-arabic-700-normal.woff2",
  "fonts/noto-naskh-arabic-latin-500-normal.woff2",
  "fonts/noto-naskh-arabic-latin-700-normal.woff2",
  "fonts/reem-kufi-arabic-600-normal.woff2",
  "fonts/reem-kufi-arabic-700-normal.woff2",
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* الشبكة أولاً (لتصل التحديثات)، ثم النسخة المحفوظة عند انقطاع الاتصال */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (m) { return m || caches.match("index.html"); });
    })
  );
});
