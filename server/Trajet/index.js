//
const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
var config = require("../config/defaultValue");


// validation des données
const Joi = require('joi');

const postSchema = Joi.object({
    depart : Joi.string()
        .required(),
    destination : Joi.string()
        .required(),
    departLat: Joi.number()
        .min(-90)
        .max(90)
        .required(),
    departLon: Joi.number()
        .min(-180)
        .max(180)
        .required(),
    destinationLat: Joi.number()
        .min(-90)
        .max(90)
        .required(),
    destinationLon: Joi.number()
        .min(-180)
        .max(180)
        .required(),
    departHeure: Joi.date()
        .required(),
    arriverHeure: Joi.date()
        .required(),
    date: Joi.date()
        .required(),
    placeDisponible: Joi.number()
        .min(1)
        .max(8-1)
        .optional(),
    GroupeTrajet: Joi.number()
        .optional(),
    conducteur: Joi.string()
        .required()
});

const findTrajetSchema = Joi.object({
   
    myLat: Joi.number()
        .min(-90)
        .max(90)
        .required(),
    myLon: Joi.number()
        .min(-180)
        .max(180)
        .required(),
    date: Joi.date()
        .required(),
    heure: Joi.date()
        .optional(),
    rayon: Joi.number()
        .min(1)
        .optional()
});

/*****************************************************
 *                      GET
 *****************************************************/

exports.getAllTrajet = (req, res) => {
    console.log("Recu : GET /Trajet");
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query('SELECT * FROM public."Trajet"', (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.json(dbRes.rows);
        client.end();
        });
}

exports.getTrajet = (req, res) => {
    console.log("Recu : GET /Trajet");
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`SELECT * FROM public."Trajet" WHERE "Trajet"."trajetID" = ${req.params.trajetID}`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.json(dbRes.rows[0]);
        client.end();
        });
}


exports.findTrajet = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET FindTrajet : ",req.body);
    
    const result = findTrajetSchema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error);
    }

    client = new Client(connectionString);
    client.connect();

    var { myLat, myLon, date, hour, rayon } = req.body;
    if(!rayon){
        rayon=config.DEFAULT_RAYON;
    }
    var myPostgresDate = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);

    var whereClause = `(6371 * acos(cos(radians(${myLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${myLon})) + sin(radians(${myLat})) * sin(radians("Trajet"."departLat")))) <= ${rayon}
        AND date_trunc('day', "Trajet"."date") = to_date('${myPostgresDate}', 'YYYY-MM-DD')`;
    
    console.log(whereClause);
    client.query(`SELECT *
        FROM public."Trajet"
        WHERE ${whereClause}`,
        (dbERR, dbRes) => {
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



exports.addTrajet = async (req, res) => {
    console.log("Recu : POST /Users/");
    res.setHeader('Content-type', 'application/json');

    console.log("POST Trajet ADD entrer : ",req.body);
    
    const result = postSchema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error);
    }

    var {depart, destination, departLat, departLon, destinationLat, destinationLon, departHeure, arriverHeure, date, placeDisponible, GroupeTrajet, conducteur} = req.body;

    if(departHeure>arriverHeure){
        res.status(400).send("depart > arriver");
    }

    client = new Client(connectionString);
    client.connect();
    var request = `"depart", "destination", "departLat", "departLon", "destinationLat", "destinationLon", "departHeure", "arriverHeure", "date", "conducteur"`;
    var data = `'${depart}', '${destination}', '${departLat}', '${departLon}', '${destinationLat}', '${destinationLon}', '${departHeure}', '${arriverHeure}', '${date}', '${conducteur}'`;

    if(placeDisponible){
        request += ', "placeDisponible"';
        data += `, '${placeDisponible}'`;
    }
    if(GroupeTrajet){
        request += ', "GroupeTrajet"';
        data += `, '${GroupeTrajet}'`;
    }
    var results = await client.query(`SELECT 1 FROM public."Users" WHERE "Users"."login" = $1`,[conducteur]);
 
    if(results.rowCount == 1){
        client.query(`INSERT INTO public."Trajet"(${request})
        VALUES (${data}) RETURNING *;`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log("POST trajet ADD ajouter : ",dbRes.rows);
        res.status(201).send(`Trajet added with ID: ${dbRes.rows[0].trajetID}`);
        client.end();
        });
    }


}

/*****************************************************
 *                      UPDATE
 *****************************************************/


/*****************************************************
 *                      DELETE
 *****************************************************/