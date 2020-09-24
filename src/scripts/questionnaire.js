// Représentation de la structure du questionnaire d’orientation
export const ORIENTATION = {
    nom: {
        previous: () => 'introduction',
        next: { residence: (profil) => profil.nom },
    },
    residence: {
        num: 1,
        previous: () => 'introduction',
        next: { foyer: (profil) => profil.isResidenceComplete() },
    },
    foyer: {
        num: 2,
        previous: () => 'residence',
        next: { antecedents: (profil) => profil.isFoyerComplete() },
    },
    antecedents: {
        num: 3,
        previous: () => 'foyer',
        next: { caracteristiques: (profil) => profil.isAntecedentsComplete() },
    },
    caracteristiques: {
        num: 4,
        previous: () => 'antecedents',
        next: {
            activitepro: (profil) =>
                profil.isCaracteristiquesComplete() && profil.age >= 15,
            pediatrie: (profil) =>
                profil.isCaracteristiquesComplete() && profil.age < 15,
        },
    },
    activitepro: {
        num: 5,
        previous: () => 'caracteristiques',
        next: {
            symptomesactuels: (profil) =>
                profil.isActiviteProComplete() &&
                (!profil.activite_pro ||
                    typeof profil.activite_pro_liberal !== 'undefined'),
        },
    },
    symptomesactuels: {
        num: 6,
        previous: () => 'activitepro',
        next: {
            conseils: (profil) =>
                profil.isSymptomesActuelsComplete() &&
                profil.symptomes_actuels &&
                !profil.symptomes_actuels_autre,
            symptomespasses: (profil) =>
                profil.isSymptomesActuelsComplete() &&
                (!profil.symptomes_actuels || profil.symptomes_actuels_autre),
        },
    },
    suividate: {
        previous: () => 'suiviintroduction',
        next: {
            suivisymptomes: (profil) => profil.suivi_start_date,
        },
    },
    suivisymptomes: {
        previous: () => 'suiviintroduction',
        next: {
            conseils: () => true,
        },
    },
    symptomespasses: {
        num: 7,
        previous: () => 'symptomesactuels',
        next: {
            conseils: (profil) =>
                profil.isSymptomesPassesComplete() && profil.symptomes_passes,
            contactarisque: (profil) => profil.isSymptomesPassesComplete(),
        },
    },
    contactarisque: {
        num: 8,
        previous: () => 'symptomespasses',
        next: {
            conseils: (profil) => profil.isContactARisqueComplete(),
        },
    },
    conseils: {},
}

export class Questionnaire {
    constructor(questions) {
        this.questions = questions
        this.total = 0
        for (const [pageName, question] of Object.entries(questions)) {
            if (question.num == 1) {
                this.firstPage = pageName
            }
            if (question.num > this.total) {
                this.total = question.num
            }
        }
    }

    before(page, profil) {
        const question = this.questions[page]
        if (typeof question === 'undefined') return

        return this.checkPathTo(page, profil)
    }

    // Vérifie si la page du questionnaire est accessible en l’état.
    // Renvoie `undefined` si c’est OK, ou le nom d’une autre page
    // accessible vers laquelle renvoyer l’utilisateur.
    checkPathTo(page, profil) {
        let step = this.firstPage
        let steps = [step]
        while (step) {
            if (step === page) {
                console.debug('success!')
                return
            }

            const nextStep = this.nextPage(step, profil)
            if (!nextStep) break
            if (steps.indexOf(nextStep) > -1) break // avoid loops

            console.debug(`next step: ${nextStep}`)
            step = nextStep
            steps.push(step)
        }
        console.debug(`could not reach ${page}`, page)

        console.debug('steps', steps)

        const lastReachablePage = steps[steps.length - 1]
        console.debug(`redirecting to ${lastReachablePage}`)
        return lastReachablePage
    }

    // Détermine la page suivante du questionnaire en fonction des réponses
    // données jusqu’ici. Les pages suivantes potentielles sont listées de
    // manière ordonnée. La page choisie est la première dont le prédicat
    // est vérifié.
    nextPage(currentPage, profil) {
        const question = this.questions[currentPage]
        if (typeof question === 'undefined') return
        if (typeof question.next === 'undefined') return

        for (const [dest, predicate] of Object.entries(question.next)) {
            if (predicate(profil)) {
                console.debug(`matched predicate for ${dest}:`, predicate)
                return dest
            } else {
                console.debug(`did not match predicate for ${dest}:`, predicate)
            }
        }
        console.debug('end of questionnaire')
    }

    // Détermine la progression dans le questionnaire (p. ex. « 2/8»)
    progress(currentPage) {
        const question = this.questions[currentPage]
        if (typeof question.num === 'undefined') return ''

        return `${question.num}/${this.total} - `
    }

    // Détermine la page précédente du questionnaire, pour pouvoir inclure
    // un lien « Retour » à chaque étape.
    previousPage(currentPage) {
        const question = this.questions[currentPage]
        if (typeof question.previous === 'undefined') return

        return question.previous()
    }
}
export default Questionnaire