require('dotenv').config()

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3001;
const io = require('socket.io')(http);
const cors = require('cors');
const morgan = require('morgan');

const conversationsRoute = require('./Endpoints/Conversations');
const messagesRoute = require('./Endpoints/Messages');
const usersRoute = require('./Endpoints/Users');

const dummyConversations = require('./Dummies/dummyConversations');
const dummyMessages = require('./Dummies/dummyMessages');

const { storeUserSocket, removeUserSocket, getUserIdFromSocket } = require('./Utils/socket.utils');
const { createConversation, getConversations } = require('./Endpoints/Controllers/ConversationController');

const {requireAuth} = require('./Middlewares/authorizarion');

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.use('/messages', messagesRoute);
app.use('/users', usersRoute);

//New Controllers connected to DB
app.get('/conversations/v2', requireAuth, getConversations);
app.post('/conversations/v2', requireAuth, createConversation(io));

//Conversations
app.post('/conversations', conversationsRoute.createConversation(io));
app.get('/conversations/:username', conversationsRoute.getUserConversations);
app.put('/conversations/:conversationId/updatetitle', conversationsRoute.updateConversationTitle(io));



io.on('connection', (socket) => {

    socket.on('login', (user) => {
        const username = user.username;

        storeUserSocket(socket.id, username);

        let userConversations = dummyConversations.getDummyConversations().filter((convo) => {
            return convo.members.includes(username);
        })

        userConversations.forEach((convo) => {
            socket.join(convo.conversationId);
        })
    });


    socket.on('message', async (messageObj) => {

        let user;
        try {
            user = await getUserIdFromSocket(socket.id);
            user = user.data
        } catch (error) {
            user = undefined;
        }

        if (user) {
            const message = {
                ...messageObj,
                date: new Date(),
                sender: user
            }

            let convo = dummyConversations.getDummyConversations().find(conversation => conversation.conversationId == messageObj.conversationId);

            convo.lastMessage = message;

            dummyMessages.getDummyMessages().push(message);

            socket.nsp.to(messageObj.conversationId).emit('incomingMessage', message);

        }
    })

    socket.on('disconnect', async () => {
        let userId;
        try {
            userId = await getUserIdFromSocket(socket.id);
        } catch (error) {
            userId = undefined;
        }
        removeUserSocket(socket.id, userId);
    })
})


http.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

