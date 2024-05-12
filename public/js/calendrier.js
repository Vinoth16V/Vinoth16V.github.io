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

const calendrier = () => {
    
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
        cell.classList.add("jour");
        cell.textContent=incrementer;
        incrementer++;
        
        row.appendChild(cell);
    }
    tableau.appendChild(row);


    for (let i = 2; i <= nbsemaine; i++) {
        let row = document.createElement('tr');
        for (let j = 1; j <= nbJourDansSemaine; j++) {
            let cell = document.createElement('td');
            cell.classList.add("jour");
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


document.querySelectorAll(".jour, .ajout, .rendez-vous").forEach(element => {
    element.addEventListener("click", function(){
        Swal.fire({
            icon: "info",
            title: "connexion",
            html: '<p>Veuillez vous &nbsp <a href="connexion"> connecter </a> &nbsp ou &nbsp <a href="inscription"> créer </a> &nbsp un compte pour </p> <b>pouvoir utiliser cette fonctionnalité.</b></p> '
        });
    });
});


