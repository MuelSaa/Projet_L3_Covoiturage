const express = require('express');
const jwt = require('jsonwebtoken')

/*****************************************************
 *                      GET
 *****************************************************/

exports.getTokenProtection = (req, res) => {
        jwt.verify(req.token,'my_secret_key',function(err,data){
            if(err){
                res.sendStatus(403);
            }else{
                res.json ({
                    text : 'this is protected',
                    data:data
                });
            }
        })
    
    };

/*****************************************************
 *                      POST
 *****************************************************/

exports.getTokenProtection = (req, res) => {
        jwt.verify(req.token,'my_secret_key',function(err,data){
            if(err){
                res.sendStatus(403);
            }else{
                res.json ({
                    text : 'this is protected',
                    data:data
                });
            }
        })
    
    };

/*****************************************************
 *                      POST
 *****************************************************/

exports.postTokenCreateToken = (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  // Partie à modifier pour l'annuaire de la faculté
  const users = [
    { login: 'Sami', password: 'bidule' },
    { login: 'Adam', password: 'bidule' },
    { login: 'Samuel', password: 'bidule' },
    { login: 'Bastien', password: 'bidule' },
  ];

  // Vérifier si les informations de connexion sont valides en parcourant le tableau d'utilisateurs
  const user = users.find(u => u.login === login && u.password === password);

  if (user) {
    const accessToken = jwt.sign({ user }, 'my_secret_key', { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user }, 'refresh_secret_key', { expiresIn: '1y' });

    // Enregistrer le Refresh Token dans un cookie sécurisé
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 31536000000 });

    res.status(201).json({ accessToken });
  } else if (req.cookies.refreshToken) { // Si le Refresh Token est présent dans les cookies de la requête
    jwt.verify(req.cookies.refreshToken, 'refresh_secret_key', (err, decoded) => {
      if (!err && decoded.user) {
        const accessToken = jwt.sign({ user: decoded.user }, 'my_secret_key', { expiresIn: '1h' }); // Prolonger la durée du Access Token d'1 heure

        res.status(201).json({ accessToken });
      } else {
        res.status(401).send('Refresh Token invalide');
      }
    });
  } else {
    res.status(401).send('Identifiants invalides');
  }
}

/*****************************************************
 *                      Protection Token 
 *****************************************************/

  exports.ensureToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader !== undefined && bearerHeader !== null) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(401);
    }
  }
