parcelRequire=function(e){var r="function"==typeof parcelRequire&&parcelRequire,n="function"==typeof require&&require,i={};function u(e,u){if(e in i)return i[e];var t="function"==typeof parcelRequire&&parcelRequire;if(!u&&t)return t(e,!0);if(r)return r(e,!0);if(n&&"string"==typeof e)return n(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}return u.register=function(e,r){i[e]=r},i=e(u),u.modules=i,u}(function (require) {var a="network-or-cache-2020-09-07",b=["/","robots.txt","/style.d68e095c.css","/main.67088854.js","/marianne-regular-webfont.b44facd6.woff2","/marianne-bold-webfont.a256cae5.woff2","/site.webmanifest","/android-chrome-192x192.43f55a71.png","/android-chrome-512x512.ecbb5c54.png","/android-chrome-512x512-maskable.604b7e49.png","/apple-touch-icon.f72e9caa.png","/safari-pinned-tab.3c583ee1.svg","mstile-150x150.png","favicon.ico","/favicon-16x16.cf5e819c.png","/favicon-32x32.9512bd90.png","/marianne.d07864ae.png","/arrow-left.58cb70ef.svg","/ei-share-apple.3406814b.svg","/map-marker2.cf561477.svg","/printer.54413b82.svg","/feedback-negatif.d7720271.svg","/feedback-positif.4e27c6f0.svg","/feedback-contact.d4ba9273.svg","/feedback-flag.6b9fd356.svg","/information.af39a78a.svg","/information-soumission.666f6c7c.svg","/select.83f99688.svg","/star.c032ebcb.svg","/trash.8f1780e9.svg","/plus-circle.9e991861.svg","/user-circle.de57182f.svg","/user-circle-blue.bf4b822f.svg","/icone_video.40f9ce90.svg","/icone_fiche.24071d75.svg","/icone_infographie.581d9f73.svg","/accueil.9813c000.svg","/nom.66c2a983.svg","/activitepro.d6eedade.svg","/antecedents.58d3fe93.svg","/caracteristiques.7c612c03.svg","/contactarisque.5fd88f1a.svg","/foyer.1d755664.svg","/pediatrieecole.5dbc0756.svg","/pediatriegeneral.de3c2a65.svg","/pediatriemedical.d0895237.svg","/residence.d3029001.svg","/symptomesactuels.3cdb7555.svg","/symptomespasses.d1d7c671.svg","suivi_gravite.svg","suivi_gravite_superieure.svg","suivi_ok.svg","suivi_stable.svg","suivi_interrogation.svg","/departements-1000m.27eaefd6.geojson"],c=2e3;function d(){return caches.keys().then(function(e){return Promise.all(e.map(function(e){if(e!==a)return console.log("Deleting old cache",e),caches.delete(e)}))})}function f(){return caches.open(a).then(function(e){return e.addAll(b)})}function g(e,s){return new Promise(function(t,i){var n=setTimeout(i,s);fetch(e).then(function(e){clearTimeout(n),t(e)},i)})}function h(e){return caches.open(a).then(function(s){return s.match(e).then(function(e){return e||Promise.reject("no-match")})})}self.addEventListener("install",function(e){console.log("The service worker is being installed"),e.waitUntil(f())}),self.addEventListener("message",function(e){"skipWaiting"===e.data&&(console.log("Activating service worker now (skip waiting)"),self.skipWaiting())}),self.addEventListener("activate",function(e){e.waitUntil(d().then(function(){console.log("The service worker is ready to handle fetches")}))}),self.addEventListener("fetch",function(e){e.respondWith(g(e.request,c).catch(function(){return console.debug("Service worker serving ".concat(e.request.url," from cache")),h(e.request)}))});return{"AaGI":{}};});