/* eslint-env serviceworker */

/* Implementation of the network-or-cache pattern:
https://serviceworke.rs/strategy-network-or-cache.html */
const CACHE_NAME = 'network-or-cache-2020-08-04'
const CACHE_FILES = [
    '/',
    'robots.txt',
    'style.css',
    'scripts/main.js',
    'fonts/marianne-regular-webfont.woff2',
    'fonts/marianne-bold-webfont.woff2',
    'site.webmanifest',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'android-chrome-512x512-maskable.png',
    'apple-touch-icon.png',
    'safari-pinned-tab.svg',
    'mstile-150x150.png',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'marianne.png',
    'arrow-left.svg',
    'ei-share-apple.svg',
    'map-marker2.svg',
    'printer.svg',
    'select.svg',
    'star.svg',
    'trash.svg',
    'plus-circle.svg',
    'user-circle.svg',
    'user-circle-blue.svg',
    'icone_video.svg',
    'icone_fiche.svg',
    'icone_infographie.svg',
    'illustrations/accueil.svg',
    'illustrations/nom.svg',
    'illustrations/activitepro.svg',
    'illustrations/antecedents.svg',
    'illustrations/caracteristiques.svg',
    'illustrations/contactarisque.svg',
    'illustrations/foyer.svg',
    'illustrations/pediatrieecole.svg',
    'illustrations/pediatriegeneral.svg',
    'illustrations/pediatriemedical.svg',
    'illustrations/residence.svg',
    'illustrations/symptomesactuels.svg',
    'illustrations/symptomespasses.svg',
    'suivi_gravite.svg',
    'suivi_gravite_superieure.svg',
    'suivi_ok.svg',
    'suivi_stable.svg',
    'suivi_interrogation.svg',
]
const TIMEOUT = 500 // ms.

self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed')

    evt.waitUntil(precache())
})

self.addEventListener('fetch', function (evt) {
    console.log('The service worker is serving the asset.')

    evt.respondWith(
        fromNetwork(evt.request, TIMEOUT).catch(function () {
            return fromCache(evt.request)
        })
    )
})

function precache() {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(CACHE_FILES)
    })
}

function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout)

        fetch(request).then(function (response) {
            clearTimeout(timeoutId)
            fulfill(response)
        }, reject)
    })
}

function fromCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match')
        })
    })
}