# Projet_L3_Covoiturage
## Membres :
Samuel Delacour - [Muelsaa](https://github.com/MuelSaa)  
Sami Guetarni - [Ednar17](https://github.com/Ednar17)  
Adam Taieb - [ ]()  
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
### MongoDB
V1 : trop relationnel
```
User
{
    "id": int,
    "prenom": String,
    "nom": String,
    "age": int,
    "voiture":{
        "marque":String,
        "modele":String,
        "place":int,
        "couleur":String,
        "plaque":String
    }
    "addresse":{
        "rue":String,
        "ville":String,
        "departement":int
    },
    "trajetAVenir":[int,int,int,..],
    "ancienConducteur":[int,int,int,..],
    "ancienPassager":[int,int,int,..],
    "note": [int,int,int,..]
}
trajet
{
    "id":int,
    "conducteur":int,
    "passager":[int,int,int,..],
    "info":{
        "heureDepart":{
            "heure":int,
            "minute":int
        },
        "lieux":{
            "rue":String,
            "ville":String,
            "departement":int
        },
        "villeDepassage":[String,String...]
    }
}
note
{
    "idTrajet":"int", //id utiliser dans user
    "idNoteur":"int",
    "idNoter":int,
    "note":int,
    "commentaire",
}
notification
{
    "idUser":int,
    "idNotif":int,
    "info":{
        ...
    }
}
```
----------------
V2
```
User
{
    "id": int,
    "prenom": String,
    "nom": String,
    "age": int,
    "voiture":{
        "marque":String,
        "modele":String,
        "place":int,
        "couleur":String,
        "plaque":String
    }
    "addresse":{
        "rue":String,
        "ville":String,
        "departement":int
    },
    "trajetAVenirConducteur":{
        "passager":[int,int,int,..],
        "info":{
            "heureDepart":{
                "heure":int,
                "minute":int
            },
            "lieux":{
                "rue":String,
                "ville":String,
                "departement":int
            },
            "villeDepassage":[String,String...]
        }
    },
    "trajetAVenirPassager":{
        "conducteur":int,
        "AutrePassager":[int,int,int,..],
        "info":{
            "heureDepart":{
                "heure":int,
                "minute":int
            },
            "lieux":{
                "rue":String,
                "ville":String,
                "departement":int
            },
            "villeDepassage":[String,String...]
        }
    },
    "ancienConducteur":{
        "passager":[int,int,int,..],
        "info":{
            "heureDepart":{
                "heure":int,
                "minute":int
            },
            "lieux":{
                "rue":String,
                "ville":String,
                "departement":int
            },
            "villeDepassage":[String,String...]
        }
    },
    "ancienPassager":{
        "conducteur":int,
        "AutrePassager":[int,int,int,..],
        "info":{
            "heureDepart":{
                "heure":int,
                "minute":int
            },
            "lieux":{
                "rue":String,
                "ville":String,
                "departement":int
            },
            "villeDepassage":[String,String...]
        }
    },
    "noteEnvoyer": [int,int,int,..] //Id des users noters
    "note":[
    {
        "idNoteur":int,
        "idTrajet":int,
        "note":int,
        "commentaire":String
    },....
    ]
}
notification
{
    "idUser":int,
    "idNotif":int,
    "info":{
        ...
    }
}
```
----------------
V3
```
User
{
    "id": int,
    "prenom": String,
    "nom": String,
    "age": int,
    "voiture":{
        "marque":String,
        "modele":String,
        "place":int,
        "couleur":String,
        "plaque":String
    }
    "addresse":{
        "rue":String,
        "ville":String,
        "departement":int
    },
    "trajetAVenirConducteur":{
        "passager":[int,int,int,..],
        "info":{
            "heureDepart":{
                "heure":int,
                "minute":int
            },
            "lieux":{
                "rue":String,
                "ville":String,
                "departement":int
            },
            "villeDepassage":[String,String...]
        }
    },
    "trajetAVenirPassager":{
        "conducteur":int,
        "AutrePassager":[int,int,int,..],
        "info":{
            "heureDepart":{
                "heure":int,
                "minute":int
            },
            "lieux":{
                "rue":String,
                "ville":String,
                "departement":int
            },
            "villeDepassage":[String,String...]
        }
    },
    "ancienConducteur":{
        "passager":[int,int,int,..],
        "info":{
            "heureDepart":{
                "heure":int,
                "minute":int
            },
            "lieux":{
                "rue":String,
                "ville":String,
                "departement":int
            },
            "villeDepassage":[String,String...]
        },
        "note":[
        {
            "id":int, //du passager
            "note":int,
            "commentaire":String
        },...
        ] //si possibiliter faire "note":{id:{"note":int,"commentaire":String}}
    },
    "ancienPassager":{
        "conducteur":int,
        "AutrePassager":[int,int,int,..],
        "info":{
            "heureDepart":{
                "heure":int,
                "minute":int
            },
            "lieux":{
                "rue":String,
                "ville":String,
                "departement":int
            },
            "villeDepassage":[String,String...]
        }
        "note":{ //conducteur
            "note":int,
            "commmentaire":String
        }
    }
}
notification
{
    "idUser":int,
    "idNotif":int,
    "info":{
        ...
    }
}
```
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
2. [ ] Creation client
## Liens
### mongoDB
[Hebergeur](mongodb.com)  
[Tuto serveur + code](https://youtu.be/CvCiNeLnZ00?t=3687)  
[comprendre mongoDB](https://www.youtube.com/watch?v=ZvPS5Gx0nnU&ab_channel=Algomius)
### Test
- [Postman](https://www.postman.com/) pour tester les requetes sur le serveur