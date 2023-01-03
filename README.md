# Projet_L3_Covoiturage
## Membres :
Samuel Delacour - [Muelsaa](https://github.com/MuelSaa)  
Sami Guetarni - [Ednar17](https://github.com/Ednar17)  
Adam Taieb - [polarkit](https://github.com/polarkit)  
Bastien Verrier - [xef1121](https://github.com/Xef1121)
## Sujet
[Sujet](https://github.com/MuelSaa/Projet_L3_Covoiturage/blob/main/Sujet.pdf)
## Installation & Run
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
champs a remplire :
```
NODE_ENV=development
DATABASE_URI=
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
1. [ ] Creation serveur
    - [x] outils pour redemarer tout seuls le serveur
    - [x] logs + erreur
    - [ ] Bon modele relationnels
    - [ ] Creation Base de donnée
    - [ ] Fichier de creation de base de donnée
2. [ ] Creation client
## Liens
### mongoDB
[Hebergeur](mongodb.com)  
[Tuto serveur + code](https://youtu.be/CvCiNeLnZ00?t=3687)  
[comprendre mongoDB](https://www.youtube.com/watch?v=ZvPS5Gx0nnU&ab_channel=Algomius)
### Test
- [Postman](https://www.postman.com/) pour tester les requetes sur le serveur
