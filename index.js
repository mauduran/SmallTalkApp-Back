const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3001;
const io = require('socket.io')(http);

let activeUsers = [];

const dummyMessages = [
    {
        roomId: 1,
        type: 'message',
        body: "Hola, cómo estás?",
        date: new Date(2019, 6, 5, 12, 24, 0),
        sender: "mau4duran"
    },
    {
        roomId: 1,
        type: 'message',
        body: "Qué tal, buen hombre.",
        date: new Date(2020, 6, 4, 14, 14, 30),
        sender: "jprr44"
    },
    {
        roomId: 1,
        type: 'message',
        body: "Cómo vamos con el sitio?",
        date: new Date(2020, 6, 5, 14, 34, 0),
        sender: "mau4duran"
    },
    {
        roomId: 1,
        type: 'message',
        body: "Bien",
        date: new Date(2020, 6, 5, 14, 35, 0),
        sender: "jprr44"
    },
    {
        roomId: 1,
        type: 'message',
        body: "Falta lo de mensajes.",
        date: new Date(2020, 6, 5, 12, 35, 20),
        sender: "jprr44"
    },
    {
        roomId: 1,
        type: 'message',
        body: "Voy",
        date: new Date(2020, 6, 5, 12, 44, 0),
        sender: "mau4duran"
    },
    {
        roomId: 2,
        type: 'message',
        body: "Voy",
        date: new Date(2020, 6, 5, 12, 44, 0),
        sender: "mau4duran"
    },

    {
        roomId: 3,
        type: 'message',
        body: "qué pedo",
        date: new Date(2020, 6, 5, 10, 40, 0),
        sender: "jsfran"
    },

    {
        roomId: 4,
        type: 'message',
        body: "heyyy",
        date: new Date(2020, 7, 5, 19, 40, 0),
        sender: "jsfran"
    },
    {
        roomId: 4,
        type: 'leave-conversation',
        body: "",
        date: new Date(),
        sender: "mau4duran"
    }
];

const dummyConversations = [
    {
        conversationId: 1,
        title: '',
        members: ['mau4duran', 'jprr44'],
        lastMessage: {
            body: "Hola, cómo estás?",
            date: new Date(2020, 6, 5, 12, 24, 0),
            sender: "mau4duran"
        }
    },
    {
        conversationId: 2,
        title: 'las señoras',
        members: ['mau4duran', 'jprr44', 'jsfran'],
        lastMessage: {
            body: "cuándo llamada? lorem ipsun dolot emmet rjvehue eofhwehoifhew eofhwhfwi",
            date: new Date(2020, 6, 3, 18, 10, 0),
            sender: "jprr44"
        }
    },
    {
        conversationId: 3,
        title: '',
        members: ['mau4duran', 'jsfran'],
        lastMessage: {
            body: "qué pedo",
            date: new Date(2020, 6, 5, 10, 40, 0),
            sender: "jsfran"
        }
    },
    {
        conversationId: 4,
        title: '',
        members: ['mau4duran', 'jsfran', 'elrolas', 'abc', 'dbba', 'rollo'],
        lastMessage: {
            body: "heyyy",
            date: new Date(2020, 7, 5, 19, 40, 0),
            sender: "jsfran"
        }
    }
];

app.use(express.json());

io.on('connection', (socket) => {

    socket.on('login', (user) => {
        const username = user.username;

        const userIndex = activeUsers.findIndex((usr) => usr, username == username);

        console.log(userIndex);
        let userObj = {
            ...user,
            socketId: socket.id
        }

        if (userIndex != -1) {
            activeUsers.splice(userIndex, 1);
        }

        activeUsers.push(userObj);

        let userConversations = dummyConversations.filter((convo)=>{
            return convo.members.includes(user.username);
        })

        userConversations.forEach((convo)=>{
            socket.join(convo.conversationId);
        })

        
        console.log(activeUsers);

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

            dummyMessages.push(message);

            socket.to(messageObj.roomId).emit('incomingMessage', message);

        }
    })

    socket.on('disconnect', ()=>{
        const user = activeUsers.find((usr)=>usr.socketId==socket.id)
    })
})


http.listen(port, () => {
    console.log(`Listening on port ${port}`)
});