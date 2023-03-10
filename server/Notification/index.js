//
const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
//


/*
passager:
j = veut rejoindre ton trajet
l = est supprimer du trajet
a = accepter dans le trajet
r = refuser dans le trajet

*/

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
    console.log("Recu : GET /Notification/"+req.params.notificationID);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`SELECT * FROM public."Notification" WHERE "Notification"."notificationID" = '${req.params.notificationID}'`, (dbERR, dbRes) => {
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
    client.query(`SELECT * FROM public."Notification" WHERE "Notification"."login" = '${req.params.login}'`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.json(dbRes.rows);
        client.end();
        });
}

exports.getReadNotification = (req, res) => {
    console.log("Recu : GET /Notification/"+req.params.login);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`SELECT * FROM public."Notification" WHERE "Notification"."login" = '${req.params.login}' AND "read" = true`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.json(dbRes.rows);
        client.end();
        });
}

exports.getUnReadNotification = (req, res) => {
    console.log("Recu : GET /Notification/"+req.params.login);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`SELECT * FROM public."Notification" WHERE "Notification"."login" = '${req.params.login}' AND "read" = false`, (dbERR, dbRes) => {
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
    
    const result = postSchema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error);
    }

    var {content, login, type} = req.body;
    client = new Client(connectionString);
    client.connect();
    
    

    client.query(`INSERT INTO public."Notification"("Content", read, login, type)
        VALUES ('${content}', false, '${login}', '${type}') RETURNING *`, (dbERR, dbRes) => {
        if (dbERR) {
        console.error(dbERR);
        res.status(500).send('Internal Server Error');
        return;
        }

        console.log("POST Notification ADD ajouter : ",dbRes.rows);
        res.status(201).send(`Notification added with notificationID: ${dbRes.rows[0].notificationID}`);
        client.end();
    });
}

/*****************************************************
 *                      UPDATE
 *****************************************************/

exports.updateNotificationStatus = (req, res) => {
    console.log("Recu : UPDATE /Notification/"+req.params.notificationID);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`UPDATE public."Notification" SET read=true WHERE "notificationID" = ${req.params.notificationID}`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send(JSON.stringify('Internal Server Error'));
            return;
        }
        res.status(200).send(JSON.stringify('ok'));
        client.end();
    });
}


/*****************************************************
 *                      DELETE
 *****************************************************/

exports.deleteNotification = (req, res) => {
    console.log("Recu : DELETE /Notification/"+req.params.notificationID);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`DELETE FROM public."Notification" WHERE "notificationID" = ${req.params.notificationID} RETURNING *`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        if(dbRes.rowCount!=0) {
            res.status(200).send(`Notification DELETED ${dbRes.rows[0].notificationID}`);
        }else{
            res.status(200).send(`No Notification DELETED`);
        }        
        client.end();
    });
}
