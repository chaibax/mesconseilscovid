import { addDatePickerPolyfill } from '../../datepicker'
import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils.js'
import { joursAvant } from '../../utils.js'

export default function depistage(form, app) {
    const datePicker = form.querySelector('#depistage_start_date')
    // Autorise seulement un intervalle de dates (7 derniers jours)
    const now = new Date()
    datePicker.setAttribute('max', now.toISOString().substring(0, 10))
    const septJoursAvant = joursAvant(7)
    datePicker.setAttribute('min', septJoursAvant.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePicker, septJoursAvant, now)

    // Remplir le formulaire avec les données du profil
    preloadCheckboxForm(form, 'depistage', app.profil)
    if (app.profil.depistage) {
        datePicker.value = app.profil.depistage_start_date
            .toISOString()
            .substring(0, 10)

        if (app.profil.depistage_type === 'antigenique') {
            form.querySelector('#depistage_type_antigenique').checked = true
        } else if (app.profil.depistage_type === 'rt-pcr') {
            form.querySelector('#depistage_type_rtpcr').checked = true
        }

        if (app.profil.depistage_resultat === 'positif') {
            form.querySelector('#depistage_resultat_positif').checked = true
        } else if (app.profil.depistage_resultat === 'negatif') {
            form.querySelector('#depistage_resultat_negatif').checked = true
        } else if (app.profil.depistage_resultat === 'en_attente') {
            form.querySelector('#depistage_resultat_en_attente').checked = true
        }
    }

    // La première case active ou désactive les autres
    var primary = form.elements['depistage']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })

    // Le libellé du bouton change en fonction des choix
    var button = form.querySelector('input[type=submit]')
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas passé de test'
        : 'Cette personne n’a pas passé de test'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    toggleFormButtonOnTextFieldsAndRadioRequired(
        form,
        button.value,
        uncheckedLabel,
        requiredLabel
    )

    // Soumission du formulaire
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.depistage = event.target.elements['depistage'].checked
        app.profil.depistage_start_date = new Date(
            event.target.elements['depistage_start_date'].value
        )
        app.profil.depistage_type =
            event.target.elements['depistage_type'].value || undefined
        app.profil.depistage_resultat =
            event.target.elements['depistage_resultat'].value || undefined

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('depistage')
        })
    })
}