require('dotenv').config();
/********************************************************** 
 *              Chargement des modules 
 **********************************************************/
// Express : serveur web 
const express = require('express');
// path : chemin
const path = require('path');
// logger : logger ce qui se passe
const { logger } = require('./middleware/logger');
// errorHandler : recuperer les erreurs
const errorHandler = require('./middleware/errorHandler');
//req->json
const bodyParser = require('body-parser')

const { client } = require("./config/serverConnection");


/*****************************************************
 *             Chargement des fonctions/routes
 *****************************************************/
const users = require("./Users");

const trajet = require("./Trajet");

const notification = require("./Notification");

/*****************************************************
 *             Lancement du serveur web
 *****************************************************/
const app = express();
const PORT = process.env.PORT || 8080;
console.log("start on port : ",process.env.PORT);

app.use(logger);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

/*****************************************************
 *                      Users
 *****************************************************/

app.get('/Users', users.getAllUsers);
app.get('/Users/:login', users.getUsers);

app.post('/Users', users.addUsers);

app.delete('/Users/:login', users.deleteUsers);

/*****************************************************
 *                      Trajet
 *****************************************************/

app.get('/Trajet', trajet.getAllTrajet);
app.get('/Trajet/:trajetID', trajet.getTrajet);
app.get('/FindTrajetDepart', trajet.findTrajetDepart);
app.get('/FindTrajetRetours', trajet.findTrajetRetours);

app.post('/Trajet', trajet.addTrajet);

app.delete('/Trajet/:trajetID', trajet.deleteTrajet);


/*****************************************************
 *                      Notification
 *****************************************************/

app.get('/Notification', notification.getAllNotification);
app.get('/NotificationID/:noficationID', notification.getNotification);
app.get('/NotificationUsers/:login', notification.getUsersNotification);

app.put('/Notification/:notificationID', notification.updateNotificationStatus);


app.post('/Notification', notification.addNotification);


/*****************************************************
 *                      Notes
 *****************************************************/


//app.use('/', express.static(path.join(__dirname, 'public')));

//app.use('/', require('./routes/root'));

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

app.listen(PORT , () => console.log('Server Runnning actually on port '+PORT));
