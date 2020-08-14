const mongoose = require('./mongoDB-connection');

let userSchema = mongoose.Schema({
    imgUrl: String,
    username: {
        type:String,
        required: true
    },
    firstName: {
        type:String,
        required: true
    },
    lastName: {
        type:String,
        required: true
    },
    location: String,
    joined: {
        type:Date,
        default: Date.now
    },
    status: String,
    email: {
        type:String,
        required: true
    },
    blockedUsers: [mongoose.Schema.Types.ObjectId],
    conversations: [mongoose.Schema.Types.ObjectId]
})

let User = mongoose.model("users", userSchema);

module.exports = User;