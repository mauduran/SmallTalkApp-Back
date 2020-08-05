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
const dummyActiveUsers = require('./Dummies/dummyActiveUsers');

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.use('/messages', messagesRoute);
app.use('/users', usersRoute);


//Conversations
app.post('/conversations', conversationsRoute.createConversation(io));
app.get('/conversations/:username', conversationsRoute.getUserConversations);
app.put('/conversations/:conversationId/updatetitle', conversationsRoute.updateConversationTitle(io));


io.on('connection', (socket) => {

    socket.on('login', (user) => {
        const username = user.username;

        let activeUsers = dummyActiveUsers.getDummyActiveUsers();
        let activeSockets = dummyActiveUsers.getDummyActiveSockets();

        activeUsers[socket.id] = username;
        activeSockets[username] = socket.id;

        let userConversations = dummyConversations.getDummyConversations().filter((convo) => {
            return convo.members.includes(username);
        })

        userConversations.forEach((convo) => {
            socket.join(convo.conversationId);
        })

        dummyActiveUsers.updateDummyActiveUsers(activeUsers);
        dummyActiveUsers.updateDummyActiveSockets(activeSockets);
    });


    socket.on('message', (messageObj) => {
        let activeUsers = dummyActiveUsers.getDummyActiveUsers();
        
        const user = activeUsers[socket.id];

        if (user) {
            const message = {
                ...messageObj,
                date: Date.now(),
                sender: user
            }

            let convo = dummyConversations.getDummyConversations().find(conversation => conversation.conversationId == messageObj.conversationId);

            convo.lastMessage = message;

            dummyMessages.getDummyMessages().push(message);

            socket.nsp.to(messageObj.conversationId).emit('incomingMessage', message);

        }
    })
    
    socket.on('disconnect', () => {
        let activeUsers = dummyActiveUsers.getDummyActiveUsers();
        let activeSockets = dummyActiveUsers.getDummyActiveSockets();

        const userId = activeUsers[socket.id];
        delete activeSockets[userId];
        delete activeUsers[socket.id];

        dummyActiveUsers.updateDummyActiveSockets(activeSockets);
        dummyActiveUsers.updateDummyActiveUsers(activeUsers);

    })

})


http.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

