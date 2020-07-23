const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3001;
const io = require('socket.io')(http);
const cors = require('cors');
const conversationsRoute = require('./Endpoints/Conversations');
const messagesRoute = require('./Endpoints/Messages');

const dummyConversations = require('./Dummies/dummyConversations');
const dummyMessages = require('./Dummies/dummyMessages');

let activeUsers = [];


app.use(express.json());
app.use(cors());

app.use('/conversations', conversationsRoute);
app.use('/messages', messagesRoute);


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
            console.log(message);

            dummyMessages.getDummyMessages().push(message);

            socket.nsp.to(messageObj.roomId).emit('incomingMessage', message);

        }
    })

    socket.on('disconnect', ()=>{
        const user = activeUsers.find((usr)=>usr.socketId==socket.id)
    })
})


http.listen(port, () => {
    console.log(`Listening on port ${port}`)
});