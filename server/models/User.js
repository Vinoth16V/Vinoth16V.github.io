const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; //expression régulière qui capture toutes les adresses email acceptées
    return re.test(email) //retourne un booléen
}

const Schema = mongoose.Schema;
const Utilisateur = new Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: "L'adresse email est nécessaire",
        validate: [validateEmail, 'Veuillez rentrer une adresse email valide'],
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    },
    num_tel:{
        type: String,
        trim: true,
        required: true,

    },
    password:{
        type: String,
        trim: true,
        required: true
    },
    profesionel:{
        type: Boolean
    }
});

module.exports = mongoose.model('User', Utilisateur);