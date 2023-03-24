//
const { Client } = require('pg');
var {client, connectionString} = require("../config/serverConnection");
//
const Joi = require('joi');

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
      return;
    });
      };
    //Moyenne GET 
  
    exports.getMoyenneNotes = (req, res) => {
      client = new Client(connectionString);
      client.connect();
      const login = req.params.noterLogin;
      client.query(
        'SELECT ROUND(COALESCE(AVG(note), 0)) as moyenne FROM "Notes" WHERE "noterLogin" = $1',
        [login],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
          }
    
          const moyenne = result.rows[0].moyenne;
    
          res.send({ moyenne });
          client.end();
        }
      );
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
      client.end();
      return;
    }
    if (result.rows.length === 0) {
      res.status(404).send('Note not found');
      client.end();
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
            client.end();
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
            client.end();
            return;
          }
          res.send(result.rows);
          client.end();
          return;
        });
      };

       exports.getNoteurLoginNote = async (req, res) => {
        res.setHeader('Content-type', 'application/json');
        client = new Client(connectionString);
        client.connect();
          const  login  = req.params.index;
          console.log(login)
          client.query('SELECT note, "noteurLogin" FROM "Notes" WHERE "noterLogin" = $1', [login], (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send(JSON.stringify('Internal Server Error'));
              client.end();
              return;
            }
            res.send(result.rows);
            client.end();
            return;
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
            client.end();
            return;
          }
          res.send(result.rows);
          client.end();
          return;
        });
      };
/*****************************************************
 *                      POST
 *****************************************************/
// Fonction de création d'une note
exports.createNote = (req, res) => {
  client = new Client(connectionString);
  client.connect();
  // Schéma de validation pour les notes
  const createNoteSchema = Joi.object({
    noteID: Joi.number().integer().required(),
    trajetID: Joi.number().integer().required(),
    commentaire: Joi.string().required(),
    note: Joi.number().integer().required(),
    noteurLogin: Joi.string().required(),
    noterLogin: Joi.string().required()
  });
  
  const { error, value } = createNoteSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { noteID, trajetID, commentaire, note, noteurLogin, noterLogin } = value;

  const insertQuery = `INSERT INTO "Notes" ("note", "noteID", "trajetID", "commentaire", "noteurLogin", "noterLogin") 
                       VALUES ($1, $2, $3, $4, $5, $6) 
                       RETURNING *`;

  client.query(insertQuery, [note, noteID, trajetID, commentaire, noteurLogin, noterLogin], (err, result) => {
    if (err) {
      console.error(err);
     return res.status(500).send(JSON.stringify('Internal Server Error'));
    }
    res.status(201).send(result.rows[0]);
  });
};

 // POST /notes - crée une nouvelle note
 exports.createNoteNotif = (req, res) => {
      client = new Client(connectionString);
      client.connect();
      // Schéma de validation pour les notes
      const createNoteSchema = Joi.object({
        trajetID: Joi.number().integer().required(),
        commentaire: Joi.string().required(),
        note: Joi.number().integer().required(),
        noteurLogin: Joi.string().required(),
        noterLogin: Joi.string().required()
      });
      
      const { error, value } = createNoteSchema.validate(req.body);
      if (error) {
        console.log(error)
        return res.status(400).send(JSON.stringify(error.details[0].message));
      }

      const { trajetID, commentaire, note, noteurLogin, noterLogin } = value;
            const insertQuery = `INSERT INTO "Notes" ("note", "trajetID", "commentaire", "noteurLogin", "noterLogin") 
                                  VALUES ($1, $2, $3, $4, $5)`;
      client.query(insertQuery, [note, trajetID, commentaire, noteurLogin, noterLogin], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send(JSON.stringify('Internal Server Error'));
        }
      });
      postNotification(`${noteurLogin} a noté votre dernier trajet`,`${noterLogin}`,"a",trajetID);
    };

/*****************************************************
 *                      UPDATE
 *****************************************************/

/*****************************************************
 *                      DELETE
 *****************************************************/
exports.deleteNote = (req, res) => {
  const dnoter = req.params.NoteID;
  console.log(dnoter);
  const client = new Client(connectionString); // initialisation de client
  client.connect();
  client.query(
    `DELETE FROM "Notes" WHERE "noteID"=$1 RETURNING *`,
    [dnoter],
    (err, result) => {
      //client.end(); // fermeture de la connexion
      if (err) {
        console.error(err);
        res.status(500).send(JSON.stringify('Internal Server Error'));
        return;
      }
      if (result.rows.length === 0) {
        res.status(404).send(JSON.stringify('Note not found'));
        return;
      }
      res.status(200).send(JSON.stringify(`Note with ID ${req.params.NoteID} successfully removed from Notes`));
      return;
    }
  );
};

