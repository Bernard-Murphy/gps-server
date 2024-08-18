self.addEventListener("install", (e) => {
  console.log("Caching resources...");
  e.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll([
        "./assets/images/blank.png",
        "./assets/images/Ethan_VanSciver.jpg",
        "./assets/images/feednanacrop.png",
        "./assets/images/logo.png",
        "./assets/images/meltrans_old.png",
        "./assets/images/meltrans.png",
        "./assets/images/stock1.jpg",
        "./assets/images/stock2.jpg",
        "./assets/images/thomastrans_alt.png",
        "./assets/images/thomastrans.png",
        "./assets/images/verifiedlogotrans_old.png",
        "./assets/images/verifiedlogotrans.png",
        "./assets/emoji/emojis.json",
        "./assets/emoji/emoji-sprite.svg",
        "./styles/bootstrap.bundle.min.js",
        "./styles/bootstrap-icons.css",
        "./styles/dark_42.css",
        "./styles/dark_42.css.map",
        "./styles/dark.css",
        "./styles/dark.css.map",
        "./styles/dark_old.css",
        "./styles/default_42.css",
        "./styles/default.css",
        "./styles/default_old.css",
        "./styles/tranth.css",
        "./styles/tranth.css.map",
        "./fonts/gijgo-material.ttf",
        "./fonts/gijgo-material.woff",
        "./fonts/Humanist-A.ttf",
        "./fonts/Humanist-B.ttf",
        "./fonts/Pokemon.ttf",
        "./fonts/roboto/KFOlCnqEu92Fr1MmEU9fABc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmEU9fBBc4.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmEU9fBxc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmEU9fCBc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmEU9fChc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmEU9fCRc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmEU9fCxc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmSU5fABc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmSU5fBBc4.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmSU5fBxc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmSU5fCBc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmSU5fChc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmSU5fCRc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmSU5fCxc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmWUlfABc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmWUlfBBc4.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmWUlfBxc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmWUlfCBc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmWUlfCRc4EsA.woff2",
        "./fonts/roboto/KFOlCnqEu92Fr1MmWUlfCxc4EsA.woff2",
        "./fonts/roboto/KFOmCnqEu92Fr1Mu4mxK.woff2",
        "./fonts/roboto/KFOmCnqEu92Fr1Mu4WxKOzY.woff2",
        "./fonts/roboto/KFOmCnqEu92Fr1Mu5mxKOzY.woff2",
        "./fonts/roboto/KFOmCnqEu92Fr1Mu72xKOzY.woff2",
        "./fonts/roboto/KFOmCnqEu92Fr1Mu7GxKOzY.woff2",
        "./fonts/roboto/KFOmCnqEu92Fr1Mu7mxKOzY.woff2",
        "./fonts/roboto/KFOmCnqEu92Fr1Mu7WxKOzY.woff2",
        "./icons/apple-touch-icon-114x114.png",
        "./icons/apple-touch-icon-120x120.png",
        "./icons/apple-touch-icon-144x144.png",
        "./icons/apple-touch-icon-152x152.png",
        "./icons/apple-touch-icon-57x57.png",
        "./icons/apple-touch-icon-60x60.png",
        "./icons/apple-touch-icon-72x72.png",
        "./icons/apple-touch-icon-76x76.png",
        "./icons/code.txt",
        "./icons/favicon-128.png",
        "./icons/favicon-16x16.png",
        "./icons/favicon-196x196.png",
        "./icons/favicon-32x32.png",
        "./icons/favicon-96x96.png",
        "./icons/favicon.ico",
        "./icons/mstile-144x144.png",
        "./icons/mstile-150x150.png",
        "./icons/mstile-310x150.png",
        "./icons/mstile-310x310.png",
        "./icons/mstile-70x70.png",
        "./scripts/detect-autofill.js",
        "./stream/peerjs.copy.js",
        "./stream/peerjs.min.js",
        "./stream/simplepeer.min.js",
        "./styles/fonts.css",
        "./styles/fonts-default.css",
        "./styles/mapbox-gl.css",
        "./styles/styles.css",
        "./styles/utilities.css",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  if (e && e !== undefined) {
    e.respondWith(
      caches.match(e.request).then((res) => {
        return res || fetch(e.request);
      })
    );
  }
});
