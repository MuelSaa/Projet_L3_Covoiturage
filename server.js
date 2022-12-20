require('dotenv').config();
/********************************************************** 
 *              Chargement des modules 
 **********************************************************/
// Express : serveur web 
const express = require('express');
// path : chemin
const path = require('path');
// logger : logger ce qui se passe
const { logger, logEvents } = require('./middleware/logger');
// errorHandler : recuperer les erreurs
const errorHandler = require('./middleware/errorHandler');
// connectDB : se connecter a la BD
const connectDB = require('./config/dbConn');
// mongoose : BD
const mongoose = require('mongoose');
/*****************************************************
 *             Lancement du serveur web
 *****************************************************/
const app = express();
const PORT = process.env.PORT || 8080;
console.log(process.env.NODE_ENV)

connectDB();

app.use(logger);

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
})



app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log("connecter a mongoDB");
    app.listen(PORT, function() {
        console.log(`C'est parti ! En attente de connexion sur le port ${PORT}...`);
    });
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t   ${err.hostname}`,'mongoError.log');
})


