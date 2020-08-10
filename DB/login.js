const mongoose = require('./mongoDB-connection');

let loginSchema = mongoose.Schema({
        userId: mongoose.Schema.Types.ObjectId,
        hash: String
})

let Login = mongoose.model("login", loginSchema);

module.exports = Login;

