//
const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
//

/*****************************************************
 *                      GET
 *****************************************************/
exports.getNotes = (req, res) => {
    console.log("Recu : GET /Note/");
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query('SELECT * FROM "Notes"', (err, result) => {
    if (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
    return;
    }
    res.send(result.rows);
    client.end();
    });
    };
    
    // GET /notes/:id - renvoie une note avec l'id spécifié
    exports.getNoteById = (req, res) => {
    const id = req.params.noteID;
    res.setHeader('Content-type', 'application/json');
    client = new Client(connectionString);
    client.connect();
    client.query('SELECT * FROM "Notes" WHERE "noteID" = $1', [id], (err, result) => {
    if (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
    return;
    }
    if (result.rows.length === 0) {
    res.status(404).send('Note not found');
    return;
    }
    res.send(result.rows[0]);
    client.end();
    });
    };


    exports.getNotesByNoteur = (req, res) => {
        const noteur = req.params.noteurLogin;
        res.setHeader('Content-type', 'application/json');
        client = new Client(connectionString);
        client.connect();
        client.query('SELECT * FROM "Notes" WHERE "noteurLogin" = $1', [noteur], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.send(result.rows);
          client.end();
        });
      };



      exports.getNotesByNoter = (req, res) => {
        const noter = req.params.noterLogin;
        res.setHeader('Content-type', 'application/json');
        client = new Client(connectionString);
        client.connect();
        client.query('SELECT * FROM "Notes" WHERE "noterLogin" = $1', [noter], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.send(result.rows);
          client.end();
        });
      };

      exports.getNotesByTrajetId = (req, res) => {
        const trajetId = req.params.TrajetID;
        res.setHeader('Content-type', 'application/json');
        client = new Client(connectionString);
        client.connect();
        client.query('SELECT * FROM "Notes" WHERE "trajetID" = $1', [trajetId], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.send(result.rows);
          client.end();
        });
      };
/*****************************************************
 *                      POST
 *****************************************************/

/*****************************************************
 *                      UPDATE
 *****************************************************/

/*****************************************************
 *                      DELETE
 *****************************************************/
//Pas encore Fonctionnel
/*exports.deleteNote = (req, res) => {
    const dnoter = req.params.NoteID;
    console.log(dnoter);
    client.query(
      `DELETE FROM "Notes" WHERE "noteID"=$1 RETURNING *`,
      [noteID],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        if (result.rows.length === 0) {
          res.status(404).send('Note not found');
          return;
        }
        res.send(result.rows[0]);
      }
    );
  };
  */
