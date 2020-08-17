const Conversation = require('../../DB/conversations');
const User = require('../../DB/users');
const db = require('../../DB/mongoDB-connection');
const { subscribeMembersToConversation } = require('../../Utils/socket.utils')

const createConversation = (io) => async (req, res) => {
    let { members } = req.body;

    let memberIds;
    if (!members) return res.status(400).send({ error: "Missing Fields" });

    try {
        memberIds = members;
        members = await User.find({
            _id: {
                $in: members
            }
        })
        members = members.map(member => ({ userId: member._id, username: member.username, lastMessageSeen: new Date() }))
    } catch (error) {
        return res.status(400).send({ error: "Could not get conversation members" });
    }

    const session = await db.startSession();
    session.startTransaction();

    await User.createCollection();
    await Conversation.createCollection();

    let newConversation = {
        members,
        lastMessage: {
            body: "",
            date: new Date(),
            sender: ""
        }
    }

    const conversationDocument = new Conversation(newConversation);

    try {
        newConversation = await conversationDocument.save({ session });
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $push: { conversations: newConversation._id } },
            { session }
        )
        subscribeMembersToConversation(io, members);
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        return res.status(400).json({ error: "Could not create new conversation" })
    }

    return res.json(newConversation);
};


const getConversations = async (req, res) => {
    const userId = req.params.userId;
    let conversations;
    try {
        conversations = await Conversation.find({"members.userId": userId});
    } catch (error) {
        console.log(error);
        conversations = []
    }

    res.json(conversations);

};

module.exports = {
    createConversation,
    getConversations
}