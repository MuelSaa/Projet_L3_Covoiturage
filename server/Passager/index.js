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
exports.postWantToJoin = (req, res) => {
    console.log("Recu : POST /Passager/");
    res.setHeader('Content-type', 'application/json');

    console.log("POST Passager ADD entrer : ",req.body);

    const result = joinTrajetSchema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error);
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
    });


}
/*****************************************************
 *                      UPDATE
 *****************************************************/
exports.updatePassagerStatus = (req, res) => {
    console.log(`Recu : UPDATE /Passager/${req.params.trajetID}/${req.params.passagerID}/${req.params.accepted}`);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    var accept = "p";
    if(req.params.accepted=="false"){
        accept="r";
    }else if(req.params.accepted=="true"){
        accept="a";
    }
    client.connect();
    client.query(`UPDATE public."Passager"
	SET "status"='${accept}'
	WHERE "trajetID"='${req.params.trajetID}' AND "passagerID"='${req.params.passagerID}';`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.status(200).send('status set to :'+accept);
        client.end();
    });
}
/*****************************************************
 *                      DELETE
 *****************************************************/