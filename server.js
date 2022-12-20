/********************************************************** 
 *              Chargement des modules 
 **********************************************************/
// Express : serveur web 
const express = require('express');
// path : chemin
const path = require('path');
/*****************************************************
 *             Lancement du serveur web
 *****************************************************/
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json);

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


app.listen(PORT, function() {
    console.log(`C'est parti ! En attente de connexion sur le port ${PORT}...`);
});
