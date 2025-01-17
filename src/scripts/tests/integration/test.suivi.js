import { assert } from 'chai'
import {
    remplirQuestionnaire,
    remplirSuivi,
    waitForPlausibleTrackingEvent,
} from './helpers'

describe('Suivi', function () {
    it('remplir le questionnaire de suivi pour moi', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:vaccins'),
            ])
        }

        // Remplir le questionnaire avec symptômes actuels.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: ['temperature'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
            departement: '80',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let statut = await page.waitForSelector(
                '#page.ready #statut-symptomatique-sans-test'
            )
            assert.equal(
                (await statut.innerText()).trim(),
                'Vous êtes peut-être porteur de la Covid. Restez isolé le temps de faire un test.'
            )
            // un bouton vers le suivi des symptômes
            let bouton = await page.waitForSelector(
                '#page.ready #conseils-personnels-symptomes-actuels-sans-depistage >> text="questionnaire de suivi"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivisymptomes')
            // un bouton pour refaire le questionnaire
            bouton = await page.waitForSelector(
                '#page.ready >> text="Revenir à l’accueil"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:introduction'),
            ])
        }

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Démarrer mon suivi"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suiviintroduction'),
            ])
        }

        // Page d’introduction du suivi.
        {
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Démarrer mon suivi"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivisymptomes'),
            ])
        }

        // La page du suivi des symptômes.
        {
            await remplirSuivi(page, {
                essoufflement: 'mieux',
                etat_general: 'mieux',
                alimentation_hydratation: 'non',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                toux: 'non',
            })

            let bouton = await page.waitForSelector('#page.ready >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:conseils'),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let gravite = await page.waitForSelector('#page.ready #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Continuez à suivre l’évolution de vos symptômes pendant votre isolement.'
            )
            // le bloc « Ma santé »
            let bloc = await page.waitForSelector('#page.ready #conseils-sante summary')
            await bloc.click()
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page.ready #conseils-sante >> text="l’historique de vos symptômes"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivihistorique')
            // un bouton pour refaire le questionnaire
            bouton = await page.waitForSelector(
                '#page.ready >> text="Revenir à l’accueil"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:introduction'),
            ])
        }

        // La page d’Introduction contient maintenant un lien vers mon suivi.
        {
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Continuer mon suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suiviintroduction'),
            ])
        }

        // La page d’introduction du suivi comporte un lien direct
        // vers mes symptômes car on a déjà renseigné la date de début.
        {
            await page.waitForSelector('#page.ready h2 >> text="Suivi de la maladie"')

            let bouton = await page.waitForSelector(
                '#page.ready >> text="Continuer mon suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivisymptomes'),
            ])
        }

        // La page du suivi des symptômes.
        {
            await remplirSuivi(page, {
                essoufflement: 'critique',
                etat_general: 'mieux',
                alimentation_hydratation: 'non',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                toux: 'non',
            })

            let bouton = await page.waitForSelector('#page.ready >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:conseils'),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 3
            let gravite = await page.waitForSelector('#page.ready #suivi-gravite-3')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Contactez le 15 ou demandez à un votre proche de le faire pour vous immédiatement.'
            )
            // le bloc « Ma santé »
            let bloc = await page.waitForSelector('#page.ready #conseils-sante summary')
            await bloc.click()
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page.ready #conseils-sante >> text="l’historique de vos symptômes"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivihistorique')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivihistorique'),
            ])
        }

        // La page de suivi d'historique.
        {
            let bilanTitle = await page.waitForSelector(
                '#page.ready #suivi-historique-content h3'
            )
            assert.equal(await bilanTitle.innerText(), 'Bilan de votre situation')
        }
    })

    it('remplir le questionnaire de suivi pour un proche', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/#'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready .js-profil-new >> text="Des conseils pour un·e proche"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:nom'),
            ])
        }

        // Remplir le questionnaire avec symptômes actuels.
        await remplirQuestionnaire(page, {
            nom: 'Mamie',
            vaccins: 'pas_encore',
            symptomesActuels: ['temperature'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
            departement: '80',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // La page de Conseils doit contenir :
        {
            // le statut
            let statut = await page.waitForSelector(
                '#page.ready #statut-symptomatique-sans-test'
            )
            assert.equal(
                (await statut.innerText()).trim(),
                'Vous êtes peut-être porteur de la Covid. Restez isolé le temps de faire un test.'
            )
            // un bouton vers le suivi des symptômes
            let bouton = await page.waitForSelector(
                '#page.ready #conseils-personnels-symptomes-actuels-sans-depistage >> text="questionnaire de suivi"'
            )
            // un bouton pour refaire le questionnaire
            bouton = await page.waitForSelector(
                '#page.ready >> text="Revenir à l’accueil"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:introduction'),
            ])
        }

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Démarrer son suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suiviintroduction'),
            ])
        }

        // Page d’introduction du suivi.
        {
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Démarrer son suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivisymptomes'),
            ])
        }

        // La page du suivi des symptômes.
        {
            await remplirSuivi(page, {
                essoufflement: 'critique',
                etat_general: 'mieux',
                alimentation_hydratation: 'non',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                toux: 'non',
                confusion: 'non',
            })

            let bouton = await page.waitForSelector('#page.ready >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:conseils'),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 3
            let gravite = await page.waitForSelector('#page.ready #suivi-gravite-3')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Contactez le 15 ou demandez à un votre proche de le faire pour vous immédiatement.'
            )
            // le bloc « Ma santé »
            let bloc = await page.waitForSelector('#page.ready #conseils-sante summary')
            await bloc.click()
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page.ready #conseils-sante >> text="l’historique des symptômes"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivihistorique')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivihistorique'),
            ])
        }

        // La page de suivi d'historique.
        {
            let bilanTitle = await page.waitForSelector(
                '#page.ready #suivi-historique-content h3'
            )
            assert.equal(await bilanTitle.innerText(), 'Bilan de votre situation')
        }
    })
})
