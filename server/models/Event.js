const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./User');

const Schema = mongoose.Schema;

const Evenement = new Schema({
    titre : {
        type : String,
        required : true,
        trim : true
    },
    date : {
        type : Date,
        required : true,
    },
    heureDebut : {
        type : String,
        required : true,
    },
    heureFin : {
        type : String ,
        required : true,
    },
    note : {
        type : String,
    },
    repetition : {
        type : String
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Event',Evenement);

//$dateToString: { format: "%d/%m/%Y", date: "$date" }
//$dateToString: { format: "%H:%M", date: "$date" } 
