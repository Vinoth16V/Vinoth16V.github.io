const express = require('express');
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const bcrypt = require('bcrypt'); // crypter decrypter le mdp
const jwt = require('jsonwebtoken'); // pour les cookies
const swal = require('sweetalert2'); // pour les pop-up
const { mongo, default: mongoose } = require('mongoose');
const moment= require('moment');

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req,res,next) => { // permettre la connexion à une page que si l'on est connecté
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json('Non autorisée');
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json('Non autorisée');
    }
};

/* GET
Admin login page
*/

router.get("/connexion", async (req,res) => {
    try {
        const locals = {
            title : 'Agenda en ligne',
            fichier_style : "calendrier_connecter.css"
        }
        res.render('admin/calendrier',{locals}); 
    } catch (error) {
        console.log(error);
    }
});

/* POST
Admin check login
*/

router.post('/connexion',async (req,res) => {
    try {
        const locals = {
            title : "Agenda en ligne",
            fichier_style : "calendrier_connecter.css"
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            console.log("connexion échoué")
            return res.status(401).json({success: false,message : 'E-mail ou mdp invalide'});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            console.log("connexion échoué")
            return res.status(401).json({success: false,message : 'E-mail ou mdp invalide'});
        }

        const token = jwt.sign({userId : user._id}, jwtSecret);
        res.cookie('token',token,{httpOnly : true});
        res.render('admin/calendrier',{locals}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
    }
});



/* GET
Page d'inscription
*/

router.get('/inscription',(req,res) => {
    try {
        const locals = {
            title : 'Agenda en ligne',
            fichier_style : "calendrier_connecter.css"
        }
        res.render('admin/calendrier',{locals});  
    } catch (error) {
        console.log(error);
    }
});

/* POST
Admin register
*/

router.post('/inscription',async (req,res) => {
    try {
        const locals = {
            title : "Agenda en ligne",
            fichier_style : "calendrier_connecter.css"
        }
        const {nom,prenom,email,num_tel,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        try {
            const user = await User.create({nom,prenom,email,num_tel,password:hashedPassword});
        } catch (error) {
            if (error.code === 11000){
                res.status(409).json({message : 'User déja crée',});
            }
            res.status(500).json({message : 'Erreur serveur interne'});
        }
        res.render('admin/calendrier',{locals}); 
    } catch (error) {
        console.log(error);
    }
});


/* POST
Search - Term
*/

router.post('/rendez-vous', async (req,res) => {
    try {
        const locals = {
            title : 'Rendez-vous',
            fichier_style : "rendez_vous.css"
        }
        let searchTerm = req.body.searchTerm;
        console.log(searchTerm);
        const data = {};
        data = await User.find({
            $or: [
                { nom: {$regex: searchTerm, $options: 'i' }}, //insensible à la casse avec regex
                { prenom: {$regex: searchTerm, $options: 'i' }}  
            ]
        })
        console.log(data);
        res.render('rendez_vous', { data, locals});
    } catch (error) {
        console.log(error);
    }
});


/* GET
déconnexion
*/

router.get('/deconnexion',(req,res) => {
    try {
        const locals = {
            title : 'Agenda en ligne',
            fichier_style : "calendrier_style.css"
        }
        res.clearCookie('token');
        res.render("calendrier",locals) 
    } catch (error) {
        console.log(error);
    }
});



/*POST
ajout événement
*/
router.post('/ajout_champ', authMiddleware, async (req,res) => {
    try {
        const locals = {
            title : 'Agenda en ligne',
            fichier_style : "calendrier_connecter.css"
        }
        const userId = req.userId;
        const nouvelEvenementData = {
            titre: req.body.titre,
            date: new Date(req.body.date),
            heureDebut: req.body.heureDebut,
            heureFin: req.body.heureFin,
            note: req.body.note,
            utilisateur: userId
        };
        try {
            const event = await Event.create(nouvelEvenementData);
            res.render('admin/calendrier', {locals});
        
        } catch (error) {
            console.log("Errror",error)
            res.status(500).json({message : 'Erreur serveur interne'});
        }
    } catch (error) {
        console.log(error);
    }
});


/* GET
informations de l'utilisateur connecté
(non utilisé pour l'instant)
*/

router.get('/info_utilisateur', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const utilisateur = await User.findById(userId);
        res.json(utilisateur);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des informations de lutilisateur' });
    }
});

/* GET
Evenements de l'utilisateur connecté
(non utilisé pour l'instant)
*/

router.get('/evenements', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const evenements = await Event.find({utilisateur:userId});
        console.log(evenements);
    } catch (error) {
        console.error(error);
    }
});

/*TEST*/

router.get('/evenements/:year/:month/:day', authMiddleware, async (req, res) => {
    const { year, month, day} = req.params;
    const userId = req.userId

    try {
        const date = new Date(Date.UTC(year, month - 1, day))
        const evenements = await Event.find({
            date: {
                $gte: date, 
                $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) 
            },
            utilisateur: userId
        });
        res.json(evenements);
    } catch (error) {
        console.error('Erreur lors de la récupération des événements pour le jour spécifié:', error);
    }
});

router.get('/evenements/:year/:month', authMiddleware, async (req, res) => {
    const { year, month} = req.params;
    const userId = req.userId
    try {
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));

        const evenements = await Event.find({
            date: {
                $gte: startDate,
                $lt: endDate
            },
            utilisateur: userId
        });
        res.json(evenements);
    } catch (error) {
        console.error('Erreur lors de la récupération des événements pour le jour spécifié:', error);
    }
});



router.get('/modif_event', authMiddleware, async (req, res) => {
    try {
        const eventID = req.query.id;
        const userId = req.userId;
        
        const evenements = await Event.find({
            _id: eventID,
            utilisateur: userId
        });
        const date = moment(evenements[0].date);
        const formattedDate = date.format('YYYY-MM-DD');
        const locals = {
            title: 'Modification de l\'événement',
            fichier_style: 'ajout_champ.css',
            event: evenements[0],
            formattedDate : formattedDate
        };
        res.render('modif_event', { locals });
    } catch (error) {
        console.error('Erreur lors de la récupération des événements pour le jour spécifié:', error);
        res.status(500).send('Une erreur est survenue lors de la récupération des détails de l\'événement.');
    }
});

/*POST
modif événement
*/
router.post('/modif_event', authMiddleware, async (req,res) => {
    try {
        const eventID = req.body.id;
        const userID = req.userId;
        const locals = {
            title : 'Agenda en ligne',
            fichier_style : "calendrier_connecter.css"
        }
        const event = await Event.findById(eventID);
        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }
        const nouvelEvenementData = {
            titre: req.body.titre,
            date: new Date(req.body.date),
            heureDebut: req.body.heureDebut,
            heureFin: req.body.heureFin,
            note: req.body.note,
            utilisateur: userID
        };
        event.titre = nouvelEvenementData.titre;
        event.date = nouvelEvenementData.date;
        event.heureDebut = nouvelEvenementData.heureDebut;
        event.heureFin = nouvelEvenementData.heureFin;
        event.note = nouvelEvenementData.note;
        await event.save();
        res.render('admin/calendrier', {locals});
    } catch (error) {
        console.log(error);
    }
});

/*POST
suppr événement
*/
router.post('/suppr_event', authMiddleware, async (req,res) => {
    try {
        const eventID = req.body.id;
        const locals = {
            title : 'Agenda en ligne',
            fichier_style : "calendrier_connecter.css"
        }
        const event = await Event.findById(eventID);
        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }
        const deletedEvent = await Event.findByIdAndDelete(eventID);
        res.render('admin/calendrier', {locals});
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;

