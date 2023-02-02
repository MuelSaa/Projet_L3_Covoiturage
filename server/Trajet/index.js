//
const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
//

exports.getAllTrajet = (req, res) => {
    console.log("Recu : GET /Trajet");
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query('SELECT * FROM public."Trajet"', (dbERR, dbRes) => {
        if (dbERR) {
            console.error(dbERR);
            res.send(500, 'Internal Server Error');
            return;
        }
        res.json(dbRes.rows);
        client.end();
        });
}

// INSERT INTO public."Trajet"(
//  depart, destination, "departLat", "departLon", "destinationLat", "destinationLon", "departHeure", "arriverHeure", date,  conducteur)
//  VALUES ('besancon', 'fac', '3', '2', '1', '1', '2004-10-19 10:23:54+02', '2004-10-19 11:23:54+02', '20230212', 'samu');

exports.addTrajet = (req, res) => {
    console.log("Recu : POST /Users/");
    res.setHeader('Content-type', 'application/json');

    console.log("POST Trajet ADD entrer : ",req.body);
    var {depart, destination, departLat, departLon, destinationLat, destinationLon, departHeure, arriverHeure, date, placeDisponible, groupeTrajet, conducteur} = req.body;
    client = new Client(connectionString);
    client.connect();
    if(isNaN(placeDisponible) || placeDisponible == null){
        placeDisponible="DEFAULT";
    }else{
        placeDisponible=`'${placeDisponible}'`;
    }
    console.log(`INSERT INTO public."Trajet"(
        depart, destination, "departLat", "departLon", "destinationLat", "destinationLon", "departHeure", "arriverHeure", date, "placeDisponible", "GroupeTrajet", conducteur)
        VALUES ('${depart}', '${destination}', '${departLat}', '${departLon}', '${destinationLat}', '${destinationLon}', '${departHeure}', '${arriverHeure}', '${date}', ${placeDisponible}, '${groupeTrajet}', '${conducteur}') RETURNING *`);
    client.query(`INSERT INTO public."Trajet"(
        depart, destination, "departLat", "departLon", "destinationLat", "destinationLon", "departHeure", "arriverHeure", date, "placeDisponible", "GroupeTrajet", conducteur)
        VALUES ('${depart}', '${destination}', '${departLat}', '${departLon}', '${destinationLat}', '${destinationLon}', '${departHeure}', '${arriverHeure}', '${date}', ${placeDisponible}, '${groupeTrajet}', '${conducteur}') RETURNING *`, (dbERR, dbRes) => {
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

