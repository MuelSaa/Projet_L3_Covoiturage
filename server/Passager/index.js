//
/*
Passager status :
en attente/pending = p
ajouter/add = a
refuser/ reject = r
*/

const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
var config = require("../config/defaultValue");


// validation des données
const Joi = require('joi');


const joinTrajetSchema = Joi.object({
    login: Joi.string()
        .required(),
    trajetID: Joi.number()
        .required(),
});
function getTrajectOwnerLogin(trajetID, callback) {
    const client = new Client(connectionString);
    client.connect();
    client.query(`SELECT "Trajet"."conducteur" FROM public."Trajet" WHERE "Trajet"."trajetID" = ${trajetID}`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            callback(dbERR, null);
            return;
        }
        
        client.end();
        callback(null, dbRes.rows[0]);
    });
}
function postNotification(content,login,type,relatedID) {
    
    client = new Client(connectionString);
    client.connect();
    const contentValue = client.escapeLiteral(content);
    console.log(`INSERT INTO public."Notification"("Content", read, login, type, "relatedID")
    VALUES (${contentValue}, false, '${login}', '${type}','${relatedID}') RETURNING *`);
    client.query(`INSERT INTO public."Notification"("Content", read, login, type, "relatedID")
    VALUES (${contentValue}, false, '${login}', '${type}','${relatedID}') RETURNING *`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            return;
        }

        console.log("POST Notification ADD ajouter : ",dbRes.rows);
        client.end();
    });
}
/*****************************************************
 *                      GET
 *****************************************************/

exports.getAllTrajetPassager = (req, res) => {
    console.log("Recu : GET /Passager/"+req.params.trajetID);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`SELECT * FROM public."Passager" WHERE "Passager"."trajetID" = '${req.params.trajetID}'`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send(JSON.stringify('Internal Server Error'));
            return;
        }
        res.json(dbRes.rows);
        client.end();
        });
}

exports.getTrajetPassagerID = (req, res) => {
    console.log("Recu : GET /PassagerID/"+req.params.passagerID);
    res.setHeader('Content-type', 'application/json');
    const client = new Client(connectionString);
    client.connect();
    const passagerID = req.params.passagerID;
    const query = `SELECT *
    FROM public."Trajet"
    WHERE "trajetID" IN (
      SELECT "trajetID"
      FROM public."Passager"
      WHERE "passagerID" = ${client.escapeLiteral(passagerID)}
    );`;

    client.query(query, (dbERR, dbRes) => {
      if (dbERR) {
        console.error(dbERR);
        res.status(500).send('Internal Server Error');
        client.end();
        return;
      }
      if (dbRes.rowCount == 0) {
        res.status(404).json([]);
        client.end();
        return;
      } else {
        const passager = dbRes.rows;
        res.status(200).send(passager);
        client.end();
        return;
      }
    });
}
/*****************************************************
 *                      POST
 *****************************************************/
exports.postWantToJoin = (req, res) => {
    console.log("Recu : POST /Passager/");
    res.setHeader('Content-type', 'application/json');

    console.log("POST Passager ADD entrer : ",req.body);

    const result = joinTrajetSchema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error);
        return;
    }

    var {trajetID, login} = req.body;

    

    client = new Client(connectionString);
    client.connect();
    var request = `"trajetID", "passagerID", "status"`;
    var data = `'${trajetID}', '${login}', 'p'`;

    client.query(`INSERT INTO public."Passager"(${request})
    VALUES (${data}) RETURNING *;`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            var msg="";
            switch(dbERR.code){
                case '23503':
                    msg='la cle etrangere n\'existe pas';
                    break;
                case '23505':
                    msg='l\'enregistrement existe deja';
                    break;
                default:
                    msg='Internal Server Error';
                    break;
            }
            res.status(500).send({message:msg,code:dbERR.code});

            return;
        }

        console.log("POST Passager ADD ajouter : ",dbRes.rows);
        res.status(201).send(`Passager added`);
        client.end();
        
        getTrajectOwnerLogin(trajetID, (err, res) => {
            if (err) {
            console.error(err);
            return;
            }
            console.log(res);
            postNotification(`${login} veut rejoindre ton trajet !`,`${res.conducteur}`,"j",trajetID);
        });
    });
}
/*****************************************************
 *                      UPDATE
 *****************************************************/
exports.updatePassagerStatus = (req, res) => {
    console.log(`Recu : UPDATE /Passager/${req.params.trajetID}/${req.params.passagerID}/${req.params.accepted}/${req.params.oldNotificationID}`);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);

    client.connect();
    client.query(`UPDATE public."Passager"
	SET "status"='${req.params.accepted=="true" ? 'a' : 'r'}'
	WHERE "trajetID"='${req.params.trajetID}' AND "passagerID"='${req.params.passagerID}';`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.status(200).send('status set to :'+req.params.accepted=="true" ? 'a' : 'r');
        client.query(`DELETE FROM public."Notification" WHERE "notificationID" = ${req.params.oldNotificationID}`, (dbERR, dbRes) => {
            if (dbERR) {
                console.error(dbERR);            
            }
            console.log("delete old notif");
        });
        client.end();
        getTrajectOwnerLogin(req.params.trajetID, (err, res) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(res);
            postNotification(`${res.conducteur} t'as ${req.params.accepted=="true" ? 'accepté' : 'refusé'} !`,`${req.params.passagerID}`,`${req.params.accepted=="true" ? 'a' : 'r'}`,req.params.trajetID);
        });
    });
}
/*****************************************************
 *                      DELETE
 *****************************************************/
//Route pour se desinscrire d'un trajet en fonction du passager et du trajetID 
exports.deletePassagerFromTrajet = (req, res) => {
    console.log(`Recu : DELETE /PassagerD/${req.params.trajetID}/${req.params.passagerID}`);
    res.setHeader('Content-type', 'application/json');
    const client = new Client(connectionString);
    client.connect();
    
    // Protéger les données avec la fonction d'échappement SQL
    const trajetID = client.escapeLiteral(req.params.trajetID);
    const passagerID = client.escapeLiteral(req.params.passagerID);

    const query = `DELETE FROM "Passager" 
                   WHERE "trajetID" = ${trajetID} 
                   AND "passagerID" = ${passagerID};`;
    
    client.query(query, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send('Internal Server Error');
            client.end();
            return;
        }
        
        getTrajectOwnerLogin(req.params.trajetID, (err, res) => {
            if (err) {
            console.error(err);
            return;
            }
            console.log(res);
            postNotification(`${req.params.passagerID} est supprimé du trajet !`,`${res.conducteur}`,"l",req.params.trajetID);
            postNotification(`${res.conducteur} t'as supprimé !`,`${req.params.passagerID}`,"l",req.params.trajetID);
        });

        if (dbRes.rowCount == 0) {
            res.status(404).send(`No passenger found for trajetID ${req.params.trajetID} and passagerID ${req.params.passagerID}`);
            client.end();
            return;
        } else {
            res.status(200).send(`Passenger with ID ${req.params.passagerID} successfully removed from trajet with ID ${req.params.trajetID}`);
            client.end();
            return;
        }
    });
};
