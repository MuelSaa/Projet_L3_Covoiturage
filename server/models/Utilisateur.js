const mongoose = require("mongoose");

const utilisateurSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

//pour faire reference a utilisateur
/*

    utilisateurs: {
        type: mongoose.Schema.Type.ObjectId,
        required: true,
        ref: 'utilisateur'
    }

*/

module.exports = mongoose.model('utilisateur', utilisateurSchema);