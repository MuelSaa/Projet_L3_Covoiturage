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
//req->json
const bodyParser = require('body-parser')

//Non-blocking PostgreSQL client
const { Client } = require('pg');
const connectionString =process.env.CONNECTING_STRING+"?sslmode=no-verify";
var client = new Client(connectionString);


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

app.get('/Users', function(req, userRes) {
    console.log("Recu : GET /Users");
    userRes.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query('SELECT * FROM public."Users"', (dbERR, dbRes) => {
        if (dbERR) {
          console.error(dbERR);
          userRes.send(500, 'Internal Server Error');
          return;
        }
      
        userRes.json(dbRes.rows);
        client.end();
      });
});
app.get('/Users/:login', function(req, res) {
    console.log("Recu : GET /Users/"+req.params.login);
    res.setHeader('Content-type', 'application/json');
    if (!req.params.login) {
      res.status(400).send('Bad Request');
      return;
    }
    client = new Client(connectionString);
    client.connect();
    client.query(`SELECT * FROM public."Users" WHERE "Users"."login" = '${req.params.login}'`, (dbERR, dbRes) => {
      if (dbERR) {
        console.error(dbERR);
        res.send(500, 'Internal Server Error');
        return;
      }
      console.log(dbRes);
      res.json(dbRes.rows);
      client.end();
    });
  });

  app.post('/Users', function(req, res) {
    console.log("Recu : POST /Users/");
    res.setHeader('Content-type', 'application/json');

    console.log("POST user ADD entrer : ",req.body);
    var {login, mdp, name, prenom, sexe, mail, telephone, bio} = req.body;
    client = new Client(connectionString);
    client.connect();
    console.log()
    client.query(`INSERT INTO public."Users"(login, mdp, nom, prenom, sexe, mail, telephone, biographie)
        VALUES ('${login}', '${mdp}', '${name}', '${prenom}', '${sexe}', '${mail}', '${telephone}', '${bio}') RETURNING *`, (dbERR, dbRes) => {
        if (dbERR) {
          console.error(dbERR);
          res.status(500).send('Internal Server Error');
          return;
        }
  
        console.log("POST user ADD ajouter : ",dbRes.rows);
        res.status(201).send(`User added with login: ${dbRes.rows[0].login}`);
        client.end();
    });

  });




  app.delete('/Users/:login', function(req, res) {
    console.log("Recu : DELETE /Users/"+req.params.login);
    res.setHeader('Content-type', 'application/json');
    if (!req.params.login) {
      res.status(400).send('Bad Request');
      return;
    }
    client = new Client(connectionString);
    client.connect();
    client.query(`DELETE FROM public."Users"
	WHERE "Users"."login"='${req.params.login}' RETURNING *`, (dbERR, dbRes) => {
        if (dbERR) {
          console.error(dbERR);
          res.status(500).send('Internal Server Error');
          return;
        }

        if(dbRes.rowCount!=0) {
          res.status(200).send(`User DELETED ${dbRes.rows[0].login}`);
        }else{
          res.status(200).send(`No User DELETED `);

        }
        client.end();
    });
  });



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

app.listen(PORT , () => console.log('Server Runnning actually on port '+PORT));
