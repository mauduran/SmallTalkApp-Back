const mongoose = require('./mongoDB-connection');

let loginSchema = mongoose.Schema({
        userId: mongoose.Schema.Types.ObjectId,
        hash: String
})

let Login = mongoose.model("logincredentials", loginSchema);

module.exports = Login;

