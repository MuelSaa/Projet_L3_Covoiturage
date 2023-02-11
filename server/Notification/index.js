//
const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
//

const Joi = require('joi');

const postSchema = Joi.object({
    content: Joi.string()
        .required(),
    login: Joi.string()
        .required(),
    type:Joi.string()
        .max(1)
        .required(),
});

/*****************************************************
 *                      GET
 *****************************************************/

exports.getAllNotification = (req, res) => {
    console.log("Recu : GET /Notification");
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query('SELECT * FROM public."Notification"', (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(dbRes.rows);
        client.end();
        });
}

exports.getNotification = (req, res) => {
    console.log("Recu : GET /Notification/"+req.params.noficationID);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`SELECT * FROM public."Notification" WHERE "Notification"."notificationID" = ${req.params.noficationID}`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.json(dbRes.rows[0]);
        client.end();
        });
}

exports.getUsersNotification = (req, res) => {
    console.log("Recu : GET /Notification/"+req.params.login);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`SELECT * FROM public."Notification" WHERE "Notification"."login" = ${req.params.login}`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.json(dbRes.rows);
        client.end();
        });
}

/*****************************************************
 *                      POST
 *****************************************************/

exports.addNotification = (req, res) => {
    console.log("Recu : POST /Notification/");
    res.setHeader('Content-type', 'application/json');

    console.log("POST Notification ADD entrer : ",req.body);
    var {content, login, type} = req.body;
    client = new Client(connectionString);
    client.connect();
    client.query(`INSERT INTO public."Notification"(Content, read, login, type)
        VALUES ('${content}', false, '${login}', '${type}') RETURNING *`, (dbERR, dbRes) => {
        if (dbERR) {
        console.error(dbERR);
        res.status(500).send('Internal Server Error');
        return;
        }

        console.log("POST Notification ADD ajouter : ",dbRes.rows);
        res.status(201).send(`Notification added with notificationID: ${dbRes.rows[0].noficationID}`);
        client.end();
    });
}

/*****************************************************
 *                      UPDATE
 *****************************************************/

/*****************************************************
 *                      DELETE
 *****************************************************/


