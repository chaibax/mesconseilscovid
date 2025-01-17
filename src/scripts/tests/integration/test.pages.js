import { assert } from 'chai'
import { remplirQuestionnaire } from './helpers'

describe('Pages', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/')
        assert.equal(
            await page.title(),
            'Mes Conseils Covid — Isolement, tests, vaccins… tout savoir pour prendre soin de votre santé'
        )
    })

    it('remplir le questionnaire avec pédiatrie', async function () {
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
                page.waitForNavigation({ url: '**/#vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '80',
            enfants: true,
            age: '12',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // Pédiatrie.
        {
            // On retrouve le titre explicite.
            let titre = await page.waitForSelector('#page.ready h2')
            assert.equal(await titre.innerText(), 'Conseils pour les enfants')

            // On retrouve le bouton pour aller vers les conseils.
            let button = await page.waitForSelector('#page.ready .js-profil-full a')
            assert.equal((await button.innerText()).trim(), 'Aller à mes conseils')
            assert.equal(await button.getAttribute('href'), '#conseils')
        }
    })

    it('on peut accéder aux CGU depuis l’accueil', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])
        await page.waitForSelector('#page.ready')

        // On va vers la page de CGU.
        {
            let bouton = await page.waitForSelector('text="Conditions d’utilisation"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conditionsutilisation' }),
            ])
        }

        // Conditions d’utilisation.
        {
            // On retrouve le bouton pour repartir vers le questionnaire.
            let button = await page.waitForSelector('#page.ready .js-profil-empty a')
            assert.equal((await button.innerText()).trim(), 'Démarrer le questionnaire')
            assert.equal(await button.getAttribute('href'), '#vaccins')
            // On retrouve le titre explicite.
            let titre = await page.waitForSelector('#page.ready h2')
            assert.equal(await titre.innerText(), 'Conditions d’utilisation')
        }
    })
})
