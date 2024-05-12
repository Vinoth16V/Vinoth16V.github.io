const express = require('express');
const connectDB = require('./server/config/db');
const utilisateur = require('../models/user');
const Swal = require('sweetalert2');
const MongoClient = require('mongodb');
const bcrypt = require("bcrypt")

const MONGODB_URI="mongodb+srv://victor:gF18fG4fdH0oTm0W@cluster0.szhix7a.mongodb.net/agenda";

const db = client.db(MONGODB_URI)

const app = express();
const client = new MongoClient(MONGODB_URI);
connectDB();

app.use(express.json());


function changer_mot_passe(){
    const email_utilisateur = document.getElementById("mail").value;
    const ancien_mdp = document.getElementById("ancien_mdp").value;
    const nouveau_mdp = document.getElementById("nouveau_mdp").value;
    const confirmation_mdp = document.getElementById("confirm_mdp").value;
    if (!ancien_mdp || !nouveau_mdp || !confirmation_mdp){
        Swal.fire({
            title: "Erreur",
            icon: "error",
            text: "Certains champs ne sont pas remplis"
        })
    }
    else if (nouveau_mdp != confirmation_mdp) {
        Swal.fire({
            title: "Erreur",
            icon: "error",
            text: "Le nouveau mot de passe et le mot de passe de confirmation ne sont pas identiques"
        })
    }
    else if (!bcrypt.compareSync(nouveau_mdp, ancien_mdp)){
        Swal.fire({
            title: "Erreur",
            icon: "error",
            text: "Le nouveau mot de passe et l'ancien mot de passe ne sont pas identiques"
        })
    }
    else {
        const hashedPassword = bcrypt.hash(password,10);
        db.collection('users').updateOne(
            {email: email_utilisateur},
            {$set : {password: hashedPassword}},
            (err, res) => {
                if (err) {
                    Swal.fire({
                        title: "Erreur",
                        icon: "error",
                        text: "Erreur inconnue, veuillez réessayer"
                    })
                    return;
                }

                Swal.fire({
                    title: "Succès !",
                    icon: "success",
                    text: "Votre mot de passe à été changé"
                })

            }
        )
    }
}

module.exports = changer_mot_passe();

/*document.getElementById("reinitialiser_mdp").addEventListener("click", function() {
    const mail = document.getElementById("mail").value;
    const ancien_mdp = document.getElementById("ancien_mdp").value;
    const nouveau_mdp = document.getElementById("nouveau_mdp").value;
    const confirmation_mdp = document.getElementById("confirm_mdp").value;
    changer_mot_passe(mail, ancien_mdp, nouveau_mdp, confirmation_mdp);
} )*/
