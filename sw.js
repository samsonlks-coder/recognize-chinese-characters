const CACHE_NAME = "zh-adventure-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./game.js",
  "./manifest.webmanifest",

  "./assets/stage1.png",
  "./assets/stage2.png",
  "./assets/stage3.png",
  "./assets/stage4.png",
  "./assets/stage5.png",

  "./assets/mario_stand.png",
  "./assets/mario_walk.png",
  "./assets/mario_jump.png",
  "./assets/mario_attack.png",

  "./assets/luigi_stand.png",
  "./assets/luigi_walk.png",
  "./assets/luigi_jump.png",
  "./assets/luigi_attack.png",

  "./assets/koopa_stand.png",
  "./assets/koopa_walk.png",
  "./assets/koopa_jump.png",
  "./assets/koopa_attack.png",

  "./assets/paratroopa_stand.png",
  "./assets/paratroopa_walk.png",
  "./assets/paratroopa_jump.png",
  "./assets/paratroopa_attack.png",

  "./assets/bulletbill_stand.png",
  "./assets/bulletbill_walk.png",
  "./assets/bulletbill_jump.png",
  "./assets/bulletbill_attack.png",

  "./assets/koopaling_stand.png",
  "./assets/koopaling_walk.png",
  "./assets/koopaling_jump.png",
  "./assets/koopaling_attack.png",

  "./assets/bowser_stand.png",
  "./assets/bowser_walk.png",
  "./assets/bowser_jump.png",
  "./assets/bowser_attack.png",

  "./assets/fireball.png",
  "./assets/greenshell.png",
  "./assets/redshell.png",
  "./assets/bulletbill.png",
  "./assets/purple_fireball.png",
  "./assets/big_fireball.png",

  "./assets/walk.mp3",
  "./assets/jump.mp3",
  "./assets/fireball.mp3",
  "./assets/shell.mp3",
  "./assets/bulletbill.mp3",
  "./assets/correct.mp3",
  "./assets/wrong.mp3",
  "./assets/win.mp3",
  "./assets/lose.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
    })
  );
});
