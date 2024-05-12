const moisHeader=document.querySelector(".mois");
const anneeHeader=document.querySelector("#annee");
const tableau=document.querySelector(".semaine");

const bouttonMois=document.querySelectorAll(".prevMois, .suivMois"),
bouttonAn=document.querySelectorAll(".prevAn, .suivAn");


let date= new Date();
let mois=date.getMonth();
let annee=date.getFullYear();
let jour=date.getDate();

const lesMois=["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre","Novemvbre", "Décembre"];
let nbsemaine=5;
let nbJourDansSemaine=7;



const calendrier = async () => {
    tableau.innerHTML = "";

    moisHeader.innerText = `${lesMois[mois]}`;
    anneeHeader.innerText = `${annee}`;

    let dernierdatedumois = new Date(annee, mois + 1, 0).getDate();
    let premierdatedumois = new Date(annee, mois, 1).getDay();
    let z = new Date(annee, mois, 0).getDate();

    let incrementer = 1,
        incrementerAp = 1;
    let decrementer = z;
    let y = decrementer - premierdatedumois + 1;

    let row = document.createElement('tr');

    for (let i = premierdatedumois; i > 0; i--) {
        let cell = document.createElement('td');
        cell.textContent = y;
        y++;
        cell.classList.add('autre-mois');
        row.appendChild(cell);
    }

    for (let j = premierdatedumois; j < nbJourDansSemaine; j++) {
        let cell = document.createElement('td');
        cell.textContent = incrementer;
        const eventsForDay = await getEventsForDay(annee, mois + 1, incrementer);
        if (eventsForDay.length > 0) {
            const eventIndicator = document.createElement('div');
            eventIndicator.classList.add('event-indicator');
            eventIndicator.textContent = eventsForDay.length;
            cell.appendChild(eventIndicator);
        }
        incrementer++;
        row.appendChild(cell);
    }
    tableau.appendChild(row);

    for (let i = 2; i <= nbsemaine; i++) {
        let row = document.createElement('tr');
        for (let j = 1; j <= nbJourDansSemaine; j++) {
            let cell = document.createElement('td');
            if (incrementer <= dernierdatedumois) {
                cell.textContent = incrementer;
                const eventsForDay = await getEventsForDay(annee, mois + 1, incrementer);
                if (eventsForDay.length > 0) {
                    const eventIndicator = document.createElement('div');
                    eventIndicator.classList.add('event-indicator');
                    eventIndicator.textContent = eventsForDay.length;
                    cell.appendChild(eventIndicator);
                }
                incrementer++;
            } else {
                cell.textContent = incrementerAp;
                incrementerAp++;
                cell.classList.add('autre-mois');
            }
            row.appendChild(cell);
        }
        tableau.appendChild(row);
    }
}

const getEventsForDay = async (year, month, day) => {
    try {
        const response = await fetch(`/evenements/${year}/${month}/${day}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('La réponse du réseau n\'est pas correcte');
        }

        const events = await response.json();
        return events; // Retourne les événements récupérés pour le jour spécifié
    } catch (error) {
        console.error('Erreur lors de la récupération des événements pour le jour spécifié:', error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
};




calendrier();

bouttonMois.forEach(icon => {
    icon.addEventListener("click", () => {
        const action = icon.getAttribute("id");
        if(action==="precedentMois"){
            if (mois===0){
                mois=11;
                annee--;
            }else{
                mois--;
            }
        }
        else if(action==="prochainMois"){
            if(mois===11) {
                mois=0;
                annee++;
            }else{
                mois++;
            }
        }
        calendrier();
    });
});



bouttonAn.forEach(icon => {
    icon.addEventListener("click", () => {
        const action=icon.getAttribute("id")
        if(action==="precedentAn"){
            annee--;
        }
        else if(action==="prochainAn"){
            annee++
        }
        calendrier();
    })
});

document.getElementById("compte").addEventListener("click", function(){
    var selectedValue = this.value;

    if (selectedValue === "deconnexion") {
        swal.fire({
            icon: "warning",
            title: "Déconnexion",
            text: "voulez-vous vous déconnecter?",
            showCancelButton: true,
            cancelButtonText: "Non",
            confirmButtonText: "Oui",
        }).then ((result)=>{
            if (result.isConfirmed) {
                fetch('/deconnexion', {
                    method: 'GET'
                })
                window.location.href=''
            }
        })
    }
})

document.addEventListener('DOMContentLoaded', () => {
    console.log("Entree dans la foncrion voir event")
    const voir_event = document.querySelector('.voir_event');
    console.log(voir_event)
    // Ajouter un gestionnaire d'événements au clic sur le lien
    voir_event.addEventListener('click', () => {
        console.log("Mois :", mois);
        console.log("Année :", annee);
        
        // Rediriger l'utilisateur vers la page voir_event.html avec les paramètres d'URL
        //window.location.href = `voir_event?mois=${mois}&annee=${annee}`;
        const url = `voir_event?mois=${mois}&annee=${annee}`;

        // Rediriger l'utilisateur vers l'URL construite
        voir_event.href = url;
    });
});



// test
/*
document.addEventListener('DOMContentLoaded', function() {
    fetch('/evenements', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La réponse du réseau n\'est pas correcte');
        }

    })
});

*/

/*ancien*/
/* const calendrier = () => {
    
    tableau.innerHTML="";

    moisHeader.innerText = `${lesMois[mois]}`;
    anneeHeader.innerText = `${annee}`;

    let dernierdatedumois = new Date(annee,mois+1,0).getDate();
    let premierdatedumois = new Date(annee,mois,0).getDay();
    let z = new Date(annee,mois,0).getDate();

    let incrementer=1, incrementerAp=1;
    let decrementer=z;
    let y=decrementer-premierdatedumois+1;

    let row=document.createElement('tr');
    
    for (let i=premierdatedumois; i>0; i--){
        let cell=document.createElement('td');
        cell.textContent=y;
        y++;
        cell.classList.add('autre-mois');
        row.appendChild(cell);
    }
    
    for (let j=premierdatedumois; j<nbJourDansSemaine; j++) {
        let cell=document.createElement('td');
        cell.textContent=incrementer;
        incrementer++;
        
        row.appendChild(cell);
    }
    tableau.appendChild(row);


    for (let i = 2; i <= nbsemaine; i++) {
        let row = document.createElement('tr');
        for (let j = 1; j <= nbJourDansSemaine; j++) {
            let cell = document.createElement('td');
            if (incrementer <= dernierdatedumois) {
                cell.textContent = incrementer;
                if (incrementer===jour && mois === new Date().getMonth() && annee===new Date().getFullYear()) {
                    cell.classList.add('aujourdhui');
                }
                incrementer++;// verifier, comparer avec incrementer et date daujourd'hui
            } else{
                cell.textContent= incrementerAp;
                incrementerAp++;
                cell.classList.add('autre-mois');
            }
            row.appendChild(cell);
        }
        tableau.appendChild(row);
    }
} 



// TEST
document.addEventListener('DOMContentLoaded', function() {
    tableau.addEventListener('click', async (event) => {
        console.log("Entree dans la fonction CLICK")
        if (event.target.tagName === 'TD') {
            const day = event.target.textContent;
            const mois = lesMois.indexOf(moisHeader.textContent) + 1;
            const annee = parseInt(anneeHeader.textContent);

            const response = await fetch(`/evenements/${annee}/${mois}/${day}`);
            console.log("reponse : ",response);
            const evenements = await response.json();

            if (evenements.length > 0) {
                afficherPopupEvenements(evenements);
            }
        }
    });
});


function afficherPopupEvenements(evenements) {
    let popupContent = '<div>';

    evenements.forEach(evenement => {
        popupContent += `Titre : ${evenement.titre}, Date : ${evenement.date}, Heure début : ${evenement.heureDebut}, Heure fin : ${evenement.heureFin}\n\n`;
    });

    popupContent += '</div>';
    Swal.fire({
        title: 'Résumé des événements',
        html: popupContent,
        showCloseButton: true,
        showConfirmButton: false,
        allowOutsideClick: true
    }).then((result) => {
        if (result.isConfirmed) {
            window.alert
        }
    });
}*/
