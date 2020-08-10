const mongoose = require('mongoose');
const URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSW}@smalltalk.29boo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("connected to DB");
    })
    .catch((error) => {
        console.log("not connected to DB");
    })

module.exports = mongoose;