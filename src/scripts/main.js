// Polyfills pour ES2015+
import 'core-js/features/array/from'
import 'core-js/features/object/assign'
import 'core-js/features/promise'

// Polyfills pour les API du navigateur
import 'core-js/web/url'
import 'core-js/web/url-search-params'
import './polyfills/custom_event'

import { register as registerTimeAgo } from 'timeago.js'

import { bindFeedback, bindFeedbackContact, bindSuppressionTotale } from './actions'
import App from './app'

var app = new App()
window.app = app
;(function () {
    app.init().then(() => {
        app.router.resolve()
        app.updater.checkForUpdatesEvery(10) // Minutes.
        bindFeedback(document.querySelector('footer .feedback-component'), app)
        bindFeedbackContact(document.querySelector('footer .js-feedback-contact'), app)
        bindSuppressionTotale(document.querySelector('footer .js-suppression'), app)
    })
})()

registerTimeAgo('fr', function (number, index) {
    return [
        ["à l'instant", 'dans un instant'],
        ['il y a %s secondes', 'dans %s secondes'],
        ['il y a 1 minute', 'dans 1 minute'],
        ['il y a %s minutes', 'dans %s minutes'],
        ['il y a 1 heure', 'dans 1 heure'],
        ['il y a %s heures', 'dans %s heures'],
        ['il y a 1 jour', 'dans 1 jour'],
        ['il y a %s jours', 'dans %s jours'],
        ['il y a 1 semaine', 'dans 1 semaine'],
        ['il y a %s semaines', 'dans %s semaines'],
        ['il y a 1 mois', 'dans 1 mois'],
        ['il y a %s mois', 'dans %s mois'],
        ['il y a 1 an', 'dans 1 an'],
        ['il y a %s ans', 'dans %s ans'],
    ][index]
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('../service-worker.js')
        .then(() => {
            // console.log('SW registration successful with scope: ', registration.scope)
        })
        .catch((err) => {
            console.log('SW registration failed: ', err)
        })
}
