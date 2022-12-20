/********************************************************** 
 *              Chargement des modules 
 **********************************************************/
// Express : serveur web 
const express = require('express');


/*****************************************************
 *             Lancement du serveur web
 *****************************************************/
const app = express();
app.use(express.json());

app.listen(8080, function() {
    console.log("C'est parti ! En attente de connexion sur le port 8080...");
});

// Configuration d'express pour utiliser le répertoire "public"
app.use(express.static('public'));
// par défaut, envoie le fichier index.html 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/index.html');
});

