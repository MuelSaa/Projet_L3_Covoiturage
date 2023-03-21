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

// const cors = require('cors');

/*****************************************************
 *             Chargement des fonctions/routes
 *****************************************************/


const users = require("./Users");

const trajet = require("./Trajet");

const notification = require("./Notification");

const passager = require("./Passager");

const note = require("./Notes")

const tokenfile = require("./Token/Token")

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

  // app.use(cors({
  //   origin: 'http://localhost:8080',
  //   methods: ['GET', 'POST'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true
  // }));
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
app.get('/Trajet/:trajetID', trajet.getAllTrajetPassager);
app.get('/FindTrajetRetours', trajet.findTrajetRetours);
app.get('/FindTrajetDepart', trajet.findTrajetDepart);
app.get('/TrajetConducteur/:conducteur', trajet.TrajetConducteur);
app.get('/TrajetConducteurHistorique/:conducteur', trajet.TrajetConducteurHistorique);
app.get('/TrajetPassager/:passagerID', trajet.TrajetPassager);
app.get('/TrajetPassagerHistorique/:passagerID', trajet.TrajetPassagerHistorique);


app.post('/Trajet', trajet.addTrajet);

app.delete('/Trajet/:trajetID', trajet.deleteTrajet);

/*****************************************************
 *                      Notification
 *****************************************************/

app.get('/Notification', notification.getAllNotification);
app.get('/NotificationID/:notificationID', notification.getNotification);
app.get('/NotificationUsers/:login', notification.getUsersNotification);
app.get('/NotificationRead/:login', notification.getReadNotification);
app.get('/NotificationUnRead/:login', notification.getUnReadNotification);

app.put('/Notification/:notificationID', notification.updateNotificationStatus);

app.post('/Notification', notification.addNotification);

app.delete('/Notification/:notificationID',notification.deleteNotification);

/*****************************************************
 *                      Passager
 *****************************************************/

app.get('/Passager/:trajetID',passager.getAllTrajetPassager);

app.get('/PassagerID/:passagerID',passager.getTrajetPassagerID);

app.post('/Passager',passager.postWantToJoin);

app.put('/Passager/:trajetID/:passagerID/:accepted/:oldNotificationID',passager.updatePassagerStatus);

app.delete('/Passager/:trajetID/:passagerID',passager.deletePassagerFromTrajet);

/*****************************************************
 *                      Notes
 *****************************************************/
app.get('/Notes',note.getNotes);

app.get('/Notes/:noteID',note.getNoteById);

app.get('/Noteur/:noteurLogin',note.getNotesByNoteur);

app.get('/MNotes/:noterLogin', note.getNotesByConducteurAndTrajet);

app.get('/NotesC/:index',note.getNoteurLoginNote);

app.get('/NoteTrajet/:TrajetID',note.getNotesByTrajetId );

app.post('/Notes',note.createNote);

app.post('/NotesC',note.createNoteNotif);

//app.put('/Unote/:NoteID',note.updateNote)

app.delete('/Notes/:NoteID',note.deleteNote);

/*****************************************************
 *                      Web Access Token 
 *****************************************************/

app.get('/api/protected' , tokenfile.ensureToken,tokenfile.getTokenProtection)
app.post('/api/protected', tokenfile.postTokenCreateToken); 
    

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
