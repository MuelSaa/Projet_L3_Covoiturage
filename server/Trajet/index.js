//
const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
var config = require("../config/defaultValue");


// validation des données
const Joi = require('joi');

const postSchema = Joi.object({
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
    placeDisponible: Joi.number()
        .min(1)
        .max(8-1)
        .optional(),
    conducteur: Joi.string()
        .required()
});

const findTrajetSchema = Joi.object({
   
    departLat: Joi.number()
        .min(-90)
        .max(90)
        .required(),
    departLon: Joi.number()
        .min(-180)
        .max(180)
        .required(),
    arriverLat: Joi.number()
        .min(-90)
        .max(90)
        .required(),
    arriverLon: Joi.number()
        .min(-180)
        .max(180)
        .required(),
    date: Joi.date()
        .required(),
    heure: Joi.date()
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


exports.findTrajetDepart = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET FindTrajetDepart : ",req.body);
    
    const result = findTrajetSchema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error);
    }

    client = new Client(connectionString);
    client.connect();

    var { departLat, departLon, arriverLat, arriverLon, date, heure } = req.body;

    var myPostgresDate = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);

    var whereClause = `(6371 * acos(cos(radians(${departLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${departLon})) + sin(radians(${departLat})) * sin(radians("Trajet"."departLat")))) <= ${config.DEFAULT_RAYON}
        AND (6371 * acos(cos(radians(${arriverLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${arriverLon})) + sin(radians(${arriverLat})) * sin(radians("Trajet"."departLat")))) <= ${config.DEFAULT_RAYON}
        AND date_trunc('day', "Trajet"."date") = to_date('${myPostgresDate}', 'YYYY-MM-DD')`;
    if(heure){
        whereClause +=` AND "Trajet"."arriverHeure"::time BETWEEN ('${heure}'::timestamp with time zone - interval '1 hour')::time AND '${heure}'::time`;
    }
    
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

exports.findTrajetRetours = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET FindTrajetRetours : ",req.body);
    
    const result = findTrajetSchema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error);
    }

    client = new Client(connectionString);
    client.connect();

    var { departLat, departLon, arriverLat, arriverLon, date, heure } = req.body;

    var myPostgresDate = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);

    var whereClause = `(6371 * acos(cos(radians(${departLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${departLon})) + sin(radians(${departLat})) * sin(radians("Trajet"."departLat")))) <= ${config.DEFAULT_RAYON}
        AND (6371 * acos(cos(radians(${arriverLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${arriverLon})) + sin(radians(${arriverLat})) * sin(radians("Trajet"."departLat")))) <= ${config.DEFAULT_RAYON}
        AND date_trunc('day', "Trajet"."date") = to_date('${myPostgresDate}', 'YYYY-MM-DD')`;
    if(heure){
        whereClause +=` AND "Trajet"."departHeure"::time BETWEEN ('${heure}'::timestamp with time zone - interval '1 hour')::time AND '${heure}'::time`;
    }
    
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

    var {departLat, departLon, destinationLat, destinationLon, departHeure, arriverHeure, placeDisponible,  conducteur} = req.body;

    if(departHeure>arriverHeure){
        res.status(400).send("depart > arrivée");
    }

    client = new Client(connectionString);
    client.connect();
    var request = `"departLat", "departLon", "destinationLat", "destinationLon", "departHeure", "arriverHeure", "conducteur"`;
    var data = `'${departLat}', '${departLon}', '${destinationLat}', '${destinationLon}', '${departHeure}', '${arriverHeure}', '${conducteur}'`;

    if(placeDisponible){
        request += ', "placeDisponible"';
        data += `, '${placeDisponible}'`;
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