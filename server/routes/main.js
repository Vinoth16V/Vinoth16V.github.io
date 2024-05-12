const express = require('express');
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");


// Routes 

/* GET
Page d'accueil
*/
router.get('',(req,res) => {
    const locals = {
        title : "Agenda en ligne",
        fichier_style : "calendrier_style.css"
    }
    res.render('calendrier',{locals});
});
/* GET
Page d'inscription
*/

router.get('/inscription',(req,res) => {
    const locals = {
        title : 'Inscription',
        fichier_style : "page_inscription.css"
    }
    res.render('inscription',{locals});
});

/* GET
Page de connexion
*/

router.get('/connexion',(req,res) => {
    const locals = {
        title : 'Connexion',
        fichier_style : "connexion.css"
    }
    res.render('connexion',{locals});
});

/* GET
Ajout champ
*/

router.get('/ajout_champ',(req,res) => {
    const locals = {
        title : 'Ajout evenemnt',
        fichier_style : "ajout_champ.css"
    }
    res.render('ajout_champ',{locals});
});

/* GET
MDP oublié
*/

router.get('/mdp_oublie',(req,res) => {
    const locals = {
        title : 'Mot de Passe oublié',
        fichier_style : "mdp_style.css"
    }
    res.render('mdp_oublie',{locals});
});

/* GET
Profil
*/

router.get('/profil',(req,res) => {
    const locals = {
        title : 'Profil',
        fichier_style : "profil.css"
    }
    res.render('profil',{locals});
});

/* GET
Voir Eveent
*/

router.get('/voir_event',(req,res) => {
    const locals = {
        title : 'Evenements',
        fichier_style : "ajout_champ.css"
    }
    res.render('voir_event',{locals});
});

/* GET
rendez-vous
*/

router.get('/rendez_vous',(req,res) => {
    const locals = {
        title : 'Rendez-vous',
        fichier_style : "rendez_vous.css"
    }
    res.render('rendez_vous',{locals});
});



/* GET
Event : id 
*/


router.get('/events:id',async (req,res) => {
    try {
        const locals = {
            title : 'Evenements',
            fichier_style : "connexion.css"
        }
        let slug = req.params.id;
        const data = await Event.findById({_id: slug});
        res.render('events',{locals, data});
    } catch (error) {
        console.log(error);
    }

});











module.exports = router;




/*
function insertuser(){
    User.insertMany([
        {
            nom : "BADY",
            prenom : "François",
            email : "frc.bdy@gmail.com",
            numero_telephone : "07 34 72 42 54",
            mot_passe : "lulu"
        }
    ])
};

insertuser();
*/
