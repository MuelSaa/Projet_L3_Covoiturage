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
        .required(),
    departAdresse: Joi.string(),
    destinationAdresse: Joi.string(),
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
    date: Joi.string()
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
exports.getOneTrajet = (req, res) => {
    console.log("Recu : GET /Trajet/:id");
    const id = req.params.id;
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query('SELECT * FROM public."Trajet" WHERE "trajetID" = $1', [id], (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        res.json(dbRes.rows);
        client.end();
        });
}

exports.trajetEffectue = async (req, res) => {
    const client = new Client(connectionString);
    try {
        await client.connect();
        console.log("Recu : GET /TrajetEffectue");  
        
        // Récupération de tous les trajets dont la date de départ est passée et notifEnvoyee est false
        const trajetsQuery = 'SELECT "trajetID" FROM "Trajet" WHERE "departHeure" < NOW() AND ("notifEnvoyee" = false OR "notifEnvoyee" IS NULL)';
        const trajetsResult = await client.query(trajetsQuery);
        const trajets = trajetsResult.rows;
        console.log("nb =" + trajets.length);
        
        // Si aucun trajet n'a besoin d'une notification
        if (trajets.length === 0) {
            return;
        }
      
        // Pour chaque trajet, on récupère les informations nécessaires et on crée une notification pour chaque passager
        for (const trajet of trajets) {
            const trajetId = trajet.trajetID;
            const conducteur = trajet.conducteur;
          
            const passagersQuery = 'SELECT "passagerID" FROM "Passager" WHERE "trajetID" = $1';
            const passagersValues = [trajetId];
            const passagersResult = await client.query(passagersQuery, passagersValues);
            const passagers = passagersResult.rows;
          
            for (const passager of passagers) {
                const login = passager.passagerID;
                const notificationContent = `Notez votre trajet précédent avec avec le conducteur ${conducteur}  !`;
                const createNotifQuery = 'INSERT INTO "Notification" ("Content", "create", "read", "login", "type", "relatedID") VALUES ($1, NOW(), false, $2, $3, $4)';
                const createNotifValues = [notificationContent, login, 'n', trajetId];
                await client.query(createNotifQuery, createNotifValues);
            }
          
            // Mise à jour de notifEnvoyee à true pour le trajet
            const updateTrajetQuery = 'UPDATE "Trajet" SET "notifEnvoyee" = true WHERE "trajetID" = $1';
            const updateTrajetValues = [trajetId];
            await client.query(updateTrajetQuery, updateTrajetValues);
        }
        
        console.log(`Toutes les notifications ont été envoyées pour les trajets ayant une date de départ passée.`);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    } finally {
        await client.end();
    }
};

  



exports.findTrajetDepart = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET FindTrajetDepart : ",req.query);
    
    const result = findTrajetSchema.validate(req.query);

    if(result.error){
        res.status(400).send(result.error);
        return;
    }

    client = new Client(connectionString);
    client.connect();

    const departLat = client.escapeLiteral(req.query.departLat);
    const departLon = client.escapeLiteral(req.query.departLon);
    const arriverLat = client.escapeLiteral(req.query.arriverLat);
    const arriverLon = client.escapeLiteral(req.query.arriverLon);
    var heure = req.query.date;
    let firstIndex = heure.indexOf(" ");
    let secondIndex = heure.indexOf(" ", firstIndex + 1);

    heure = heure.slice(0, secondIndex) + "+" + heure.slice(secondIndex + 1);
    heure = client.escapeLiteral(heure);

    var whereClause = `(6371 * acos(cos(radians(${departLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${departLon})) + sin(radians(${departLat})) * sin(radians("Trajet"."departLat")))) <= ${config.DEFAULT_RAYON}
        AND (6371 * acos(cos(radians(${arriverLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${arriverLon})) + sin(radians(${arriverLat})) * sin(radians("Trajet"."departLat")))) <= ${config.DEFAULT_RAYON}
        AND date_trunc('day', "Trajet"."arriverHeure" AT TIME ZONE 'UTC') = date_trunc('day', ${heure}::timestamp with time zone AT TIME ZONE 'UTC')
        AND "Trajet"."arriverHeure"::time BETWEEN (${heure}::timestamp with time zone - interval '1 hour')::time AND ${heure}::time`;

    console.log(whereClause);
    client.query(`SELECT *
        FROM public."Trajet"
        WHERE ${whereClause}`, (dbERR, dbRes) => {
        if (dbERR) {
            console.log("erreur");
            console.error(dbERR);
            res.status(500).send( 'Internal Server Error');
            return;
        }
        console.log("ok :");
        console.log(dbRes.rows);
        res.status(200).send(dbRes.rows);
        client.end();
        });
}

exports.findTrajetRetours = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET FindTrajetRetours : ",req.query);
    
    const result = findTrajetSchema.validate(req.query);

    if(result.error){
        res.status(400).send(result.error);
    }

    client = new Client(connectionString);
    client.connect();

    const departLat = client.escapeLiteral(req.query.departLat);
    const departLon = client.escapeLiteral(req.query.departLon);
    const arriverLat = client.escapeLiteral(req.query.arriverLat);
    const arriverLon = client.escapeLiteral(req.query.arriverLon);
    var heure = req.query.date;
    let firstIndex = heure.indexOf(" ");
    let secondIndex = heure.indexOf(" ", firstIndex + 1);

    heure = heure.slice(0, secondIndex) + "+" + heure.slice(secondIndex + 1);
    heure = client.escapeLiteral(heure);

    var whereClause = `(6371 * acos(cos(radians(${departLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${departLon})) + sin(radians(${departLat})) * sin(radians("Trajet"."departLat")))) <= ${config.DEFAULT_RAYON}
        AND (6371 * acos(cos(radians(${arriverLat})) * cos(radians("Trajet"."departLat")) * cos(radians("Trajet"."departLon") - radians(${arriverLon})) + sin(radians(${arriverLat})) * sin(radians("Trajet"."departLat")))) <= ${config.DEFAULT_RAYON}
        AND date_trunc('day', "Trajet"."arriverHeure" AT TIME ZONE 'UTC') = date_trunc('day', ${heure}::timestamp with time zone AT TIME ZONE 'UTC')
        AND "Trajet"."arriverHeure"::time BETWEEN (${heure}::timestamp with time zone - interval '1 hour')::time AND ${heure}::time`;
    
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

exports.TrajetConducteur = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET TrajetConducteurHistorique : ", req.params.conducteur);
    
    const client = new Client(connectionString);
    client.connect();

    const conducteur = client.escapeLiteral(req.params.conducteur);

    const whereClause = `"Trajet"."conducteur" = ${conducteur} AND "Trajet"."departHeure" > NOW()`;
    
    const sqlQuery = `SELECT "Trajet".*, 
                            COALESCE("PassagersAcceptes"."nbPassagersAcceptes", 0) AS "nbPassagers"
                     FROM public."Trajet"
                     LEFT JOIN (
                         SELECT "trajetID", COUNT(*) AS "nbPassagersAcceptes"
                         FROM public."Passager"
                         WHERE "Passager"."status" = 'a'
                         GROUP BY "trajetID"
                     ) AS "PassagersAcceptes" ON "Trajet"."trajetID" = "PassagersAcceptes"."trajetID"
                     WHERE ${whereClause}`;

    console.log(sqlQuery);

    client.query(sqlQuery, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(dbRes.rows);
        client.end();
    });
}


exports.TrajetConducteurHistorique = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET TrajetConducteurHistorique : ",req.params.conducteur);
    
    client = new Client(connectionString);
    client.connect();

    const conducteur = client.escapeLiteral(req.params.conducteur);

    var whereClause = `"Trajet"."conducteur" = ${conducteur} AND "Trajet"."arriverHeure" < NOW()`;
    
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
exports.TrajetPassager = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET TrajetPassager : ",req.params.passagerID);
    
    client = new Client(connectionString);
    client.connect();

    const passager = client.escapeLiteral(req.params.passagerID);

    var whereClause = `"Passager"."passagerID" = ${passager} AND "Passager"."status" = 'a' AND "Trajet"."departHeure" > NOW()`;
    
    console.log(whereClause);
    client.query(`SELECT "Trajet".*
    FROM public."Trajet" INNER JOIN public."Passager" ON "Passager"."trajetID" = "Trajet"."trajetID"
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
exports.TrajetPassagerHistorique = (req, res) => {
    res.setHeader('Content-type', 'application/json');

    console.log("GET TrajetConducteurHistorique : ",req.params.passagerID);
    
    client = new Client(connectionString);
    client.connect();

    const passager = client.escapeLiteral(req.params.passagerID);

    var whereClause = `"Passager"."passagerID" = ${passager} AND "Passager"."status" = 'a' AND "Trajet"."arriverHeure" < NOW()`;
    
    console.log(whereClause);
    client.query(`SELECT "Trajet".*
    FROM public."Trajet" INNER JOIN public."Passager" ON "Passager"."trajetID" = "Trajet"."trajetID"
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

    var {departLat, departLon, destinationLat, destinationLon, departHeure, arriverHeure, placeDisponible,  conducteur, departAdresse, destinationAdresse} = req.body;

    if(departHeure>arriverHeure){
        res.status(400).send("depart > arrivée");
    }

    client = new Client(connectionString);
    client.connect();
    var request = `"departLat", "departLon", "destinationLat", "destinationLon", "departHeure", "arriverHeure", "conducteur", "departAdresse", "destinationAdresse"`;
    var data = `'${departLat}', '${departLon}', '${destinationLat}', '${destinationLon}', '${departHeure}', '${arriverHeure}', '${conducteur}', '${departAdresse}', '${destinationAdresse}'`;

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

exports.deleteTrajet = (req, res) => {
    console.log("Recu : DELETE /Trajet/"+req.params.trajetID);
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query(`DELETE FROM public."Trajet" WHERE "Trajet"."trajetID" = ${req.params.trajetID} returning *`, (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.status(500).send('Internal Server Error');
            return;
        }

        if(dbRes.rowCount!=0) {
            res.status(200).send(`Trajet DELETED ${dbRes.rows[0].trajetID}`);
        }else{
            res.status(200).send(`No trajet DELETED`);
        }

        client.end();
        });
}
