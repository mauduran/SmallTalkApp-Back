const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3001;
const io = require('socket.io')(http);
const cors = require('cors');
const conversationsRoute = require('./Endpoints/Conversations');
const messagesRoute = require('./Endpoints/Messages');
const usersRoute = require('./Endpoints/Users');

const dummyConversations = require('./Dummies/dummyConversations');
const dummyMessages = require('./Dummies/dummyMessages');
// const dummyUsers = require('./Dummies/dummyUsers');

let activeUsers = [];


app.use(express.json());
app.use(cors());

app.use('/conversations', conversationsRoute);
app.use('/messages', messagesRoute);
app.use('/users', usersRoute);


io.on('connection', (socket) => {

    socket.on('login', (user) => {
        const username = user.username;

        const userIndex = activeUsers.findIndex((usr) => usr.username == username);

        let userObj = {
            ...user,
            socketId: socket.id
        }

        if (userIndex != -1) {
            activeUsers.splice(userIndex, 1);
        }

        activeUsers.push(userObj);

        let userConversations = dummyConversations.getDummyConversations().filter((convo)=>{
            return convo.members.includes(user.username);
        })

        userConversations.forEach((convo)=>{
            socket.join(convo.conversationId);
        })

        console.log(activeUsers)
    });


    socket.on('message', (messageObj)=>{
        const user = activeUsers.find((usr)=>usr.socketId==socket.id);

        if(user){
            const message = {
                ...messageObj,
                date: Date.now(),
                sender: user.username
            }

            let convo = dummyConversations.getDummyConversations().find(conversation=>conversation.conversationId==messageObj.conversationId);

            convo.lastMessage = message;
            console.log(messageObj);

            dummyMessages.getDummyMessages().push(message);

            socket.nsp.to(messageObj.conversationId).emit('incomingMessage', message);

        }
    })

    socket.on('disconnect', ()=>{
        const user = activeUsers.find((usr)=>usr.socketId==socket.id)
    })
})


http.listen(port, () => {
    console.log(`Listening on port ${port}`)
});