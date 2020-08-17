const mongoose = require('./mongoDB-connection');

let conversationSchema = mongoose.Schema({
    title: {type: String, default: ""},
    imgUrl: {type: String, default: ""},
    members: [{userId: mongoose.Schema.Types.ObjectId, username: String, lastMessageSeen: Date}],
    lastMessage: {
        _id: mongoose.Schema.Types.ObjectId,
        body: String,
        date: Date,
        sender: {userId: mongoose.Schema.Types.ObjectId, username: String}
    }
})

let Conversation = mongoose.model("conversations", conversationSchema);

module.exports = Conversation;

