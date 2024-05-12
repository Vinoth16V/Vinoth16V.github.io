
const afficherEvenements = (evenements) => {
    // Supposons que vous ayez un élément HTML avec l'ID "liste-evenements" où vous souhaitez afficher les événements
    const listeEvenements = document.getElementById('liste-evenements');
    // Efface le contenu précédent
    listeEvenements.innerHTML = '';
    // Parcourez les événements et ajoutez-les à la liste
    evenements.forEach(evenement => {
        const evenementHTML = `
            <div class="evenement">
                <h3><a href="/modif_event?id=${evenement._id}">${evenement.titre}</a></h3>
                <p>Date : ${new Date(evenement.date).toLocaleDateString('fr-FR')}</p>
                <p>Heure de début : ${evenement.heureDebut}</p>
                <p>Heure de fin : ${evenement.heureFin}</p>
                <p>Note : ${evenement.note}</p>
            </div>
        `;
        listeEvenements.innerHTML += evenementHTML;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const lesMois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
    const moisHeader = document.querySelector(".mois");
    const anneeHeader = document.querySelector("#annee");

    let date = new Date();
    const urlParams = new URLSearchParams(window.location.search);
    //const mois = urlParams.get('mois');
    const mois = parseInt(urlParams.get('mois')) ;

    const annee = urlParams.get('annee');
    const afficherEvenementsMois = async (annee, mois) => {
        try {
            const response = await fetch(`/evenements/${annee}/${mois}`, {
                method: 'GET'
            });
            console.log(response)
            if (!response.ok) {
                throw new Error('La réponse du réseau n\'est pas correcte');
            }
            const evenements = await response.json();
            console.log(evenements)
            afficherEvenements(evenements);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements du mois:', error);
        }
    };

    moisHeader.innerText = `${lesMois[mois]}`;
    anneeHeader.innerText = `${annee}`;
    afficherEvenementsMois(annee, mois + 1);
});


// ${new Date(evenement.date).toLocaleDateString('fr-FR')}