# Projet_L3_Covoiturage
## Membres :
Samuel Delacour - [Muelsaa](https://github.com/MuelSaa)  
Sami Guetarni - [Ednar17](https://github.com/Ednar17)  
Adam Taieb - [polarkit](https://github.com/polarkit)  
Bastien Verrier - [xef1121](https://github.com/Xef1121)
## Sujet
[Sujet](https://github.com/MuelSaa/Projet_L3_Covoiturage/blob/main/Sujet.pdf)
## Server Installation & Run
### Install
```
npm install --production=false
```
### Run
```
npm run dev
npm run start
```

### dotEnv
champs à remplir :
```
PORT=8080
CONNECTING_STRING=
```
## Structure
### Base de donnée
![Diagram Base de donée](/docs/diagramDB.png)
## Module npm
### Basic
- Express
- mongoose (gerer mongoDB)

### Ajouté 
- date-fns (manipulation de date)
- dotenv (donnée priver)
### Peut-etre utile
- mongoose-sequence
### Dev
- nodemon (redemare le serveur)
## Liste de tache
### BackEnd
1. [ ] DB
    - [ ] Fonction INSERT,UPDATE, DELETE Users
    - [ ] Creer modele base de donné
    - [ ] Fonction INSERT,UPDATE, DELETE pour trajet et associer (GTrajet et Passager)
    - [ ] Fonction INSERT,UPDATE, DELETE Notes
    - [ ] Fonction INSERT,UPDATE, DELETE Notification
    - [ ] Test des fonctions INSERT,UPDATE, DELETE de chaque table
    - [ ] Fonction INSERT,UPDATE, DELETE Véhicule
2. [ ] V1
    - [ ] lier backEnd avec le front pour une premiere version (visionner les trajets disponible) clients => serveur => bd => serveur =>clients
    - [ ] ajouter des trajets
    - [ ] s'enregistrer en tant qu'user
    - [ ] login avec mdp + verification de la connection pour l'ajout de trajet et rejoindre un trajet
3. [ ] information utilisateur
    - [ ] ajout/modification des infos utilisateur
    - [ ] ajouter/modifier/supprimer voiture (en vue d'avoir une liste des voitures disponible)
4. [ ] Note
    - [ ] gerer les notes envoyer
    - [ ] recuperer les notes qu'un clients a recu/emis
5. [ ] Notification
    - [ ] ajout de notification
    - [ ] envoyer les notifications stoquer dans la BD
    - [ ] traiter les notifications pour un clients en ligne
### FrontEnd
1. [ ] Base
    - [ ] Comprendre comment marche une PWA
    - [ ] Mettre en place la PWA
    - [ ] configurer pour que la PWA se mette a jours quand le code change
2. [ ] V1
    - [ ] choisir un design pour le mobile
    - [ ] choisir les couleurs
    - [ ] creer ce designe
    - [ ] page des trajets (fonction recherche pour afficher les trajets)
    - [ ] ajouter un trajet (recurence comprise)
    - [ ] page d'inscription connexion (juste login/mdp)
    - [ ] test pour detecter les problemes/ verifier que le design est respecter (V1)
3. [ ] Profile
    - [ ] page pour ajouter/modifier les informations utilisateurs
    - [ ] page profiles des autes utilisateurs
    - [ ] si page différente page voiture (regarder API pour les plaques d'imatriculation pour aucompletion des informations) si on a le droit de la demander
    - [ ] Verification
4. [ ] Note et notification
    - [ ] page (personels) pour voir les notes recu/envoyer
    - [ ] a la suite d'un trajet pouvoir noter (le conducteur => les passagers et les passagers => le conducteur)
    - [ ] emmètre des notifications (passager demande a rejoindre un trajet, conducteur accepte passager, demande de notation...)
    - [ ] onglet/page notification (pour l'instant recu de la bd)
    - [ ] gerer notification entre utilisateur connecter
    - [ ] test + verification
5. [ ] supplement
    - [ ] Responsive design pour les ecran d'ordinateur
6. [ ] Final
    - [ ] test final regarder que toute les fonctionnalité fonctionne, que aucun bug n'est présent.
    - [ ] verification que le rendu correspond au sujet
## Liens
### PostGreSQl
[Hebergeur](https://render.com/) - fichier creation BD disponible dans le dossier docs  
[Tuto serveur + code](https://youtu.be/CvCiNeLnZ00?t=3687)  
### Test
- [Postman](https://www.postman.com/) pour tester les requetes sur le serveur
