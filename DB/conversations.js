const mongoose = require('./mongoDB-connection');

let conversationSchema = mongoose.Schema({
    title: String,
    imgUrl: String,
    members: [{userId: ObjectId, username: String, lastMessageSeen: Date}],
    lastMessage: {
        _id: ObjectId,
        body: String,
        date: Date,
        sender: {userId: ObjectId, username: String}
    }
})

let Conversation = mongoose.model("conversations", conversationSchema);

module.exports = Conversation;

