require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser'); //sauvegarder session quand on se connecte
const MongoStore = require('connect-mongo');
const session = require('express-session');

const app = express();
const PORT = 4000 || process.env.PORT;

//Connection à la base de donnée
connectDB();
//Recevoir des données via les form
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store : MongoStore.create({
        mongoUrl : process.env.MONGODB_URI
    })
}));

app.use(express.static('public')); // facilite le lien entre fichiers css et html par exemple

// Templating Engine
app.use(expressLayout);
app.set('layout', 'layouts/main'); // default layout
app.set('view engine', 'ejs');

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});