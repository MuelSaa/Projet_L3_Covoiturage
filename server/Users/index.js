//
const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
//

exports.getAllUsers = (req, userRes) => {
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
}

exports.getUsers = (req, res) => {
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
}


exports.addUsers = (req, res) => {
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
}

exports.deleteUsers = (req, res) => {
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
}