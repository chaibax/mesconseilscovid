import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnCheckRequired,
} from '../../formutils.js'

import { beforeActivitePro } from './activitepro.js'

export function beforeSymptomesActuels(profil) {
    const target = beforeActivitePro(profil)
    if (target) return target

    // Si la personne a coché une activité pro, on propose à nouveau cet écran
    // pour prendre en compte la nouvelle case : profession libérale.
    if (profil.activite_pro && typeof profil.activite_pro_liberal === 'undefined')
        return 'activitepro'

    if (!profil.isActiviteProComplete()) return 'activitepro'
}

export function symptomesactuels(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'symptomes_actuels', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_temperature', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_temperature_inconnue', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_toux', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_odorat', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_douleurs', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_diarrhee', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_fatigue', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_alimentation', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_souffle', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_autre', app.profil)
    var primary = form.elements['symptomes_actuels']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas de symptômes actuellement'
        : 'Cette personne n’a pas de symptômes actuellement'
    const requiredLabel = 'Vous devez saisir l’un des sous-choix proposés'
    toggleFormButtonOnCheckRequired(form, button.value, uncheckedLabel, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_actuels =
            event.target.elements['symptomes_actuels'].checked
        app.profil.symptomes_actuels_temperature =
            event.target.elements['symptomes_actuels_temperature'].checked
        app.profil.symptomes_actuels_temperature_inconnue =
            event.target.elements['symptomes_actuels_temperature_inconnue'].checked
        app.profil.symptomes_actuels_toux =
            event.target.elements['symptomes_actuels_toux'].checked
        app.profil.symptomes_actuels_odorat =
            event.target.elements['symptomes_actuels_odorat'].checked
        app.profil.symptomes_actuels_douleurs =
            event.target.elements['symptomes_actuels_douleurs'].checked
        app.profil.symptomes_actuels_diarrhee =
            event.target.elements['symptomes_actuels_diarrhee'].checked
        app.profil.symptomes_actuels_fatigue =
            event.target.elements['symptomes_actuels_fatigue'].checked
        app.profil.symptomes_actuels_alimentation =
            event.target.elements['symptomes_actuels_alimentation'].checked
        app.profil.symptomes_actuels_souffle =
            event.target.elements['symptomes_actuels_souffle'].checked
        app.profil.symptomes_actuels_autre =
            event.target.elements['symptomes_actuels_autre'].checked
        if (app.profil.symptomes_actuels && !app.profil.symptomes_actuels_autre) {
            // On complète manuellement le formulaire pour le rendre complet.
            app.profil.symptomes_passes = false
            app.profil.contact_a_risque = false
            app.profil.contact_a_risque_meme_lieu_de_vie = undefined
            app.profil.contact_a_risque_contact_direct = undefined
            app.profil.contact_a_risque_actes = undefined
            app.profil.contact_a_risque_espace_confine = undefined
            app.profil.contact_a_risque_meme_classe = undefined
            app.profil.contact_a_risque_stop_covid = undefined
            app.profil.contact_a_risque_autre = undefined
            app.enregistrerProfilActuel()
            if (app.profil.symptomes_start_date) {
                router.navigate('suiviintroduction')
            } else {
                router.navigate('suividate')
            }
        } else {
            app.enregistrerProfilActuel()
            router.navigate('symptomespasses')
        }
    })
}