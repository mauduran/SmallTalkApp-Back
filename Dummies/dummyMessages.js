const dummyMessages = [
    {
        conversationId: 1,
        type: 'message',
        body: "Hola, cómo estás?",
        date: new Date(2019, 6, 5, 12, 24, 0),
        sender: "mau4duran"
    },
    {
        conversationId: 1,
        type: 'message',
        body: "Qué tal, buen hombre.",
        date: new Date(2020, 6, 4, 14, 14, 30),
        sender: "jprr44"
    },
    {
        conversationId: 1,
        type: 'message',
        body: "Cómo vamos con el sitio?",
        date: new Date(2020, 6, 5, 14, 34, 0),
        sender: "mau4duran"
    },
    {
        conversationId: 1,
        type: 'message',
        body: "Bien",
        date: new Date(2020, 6, 5, 14, 35, 0),
        sender: "jprr44"
    },
    {
        conversationId: 1,
        type: 'message',
        body: "Falta lo de mensajes.",
        date: new Date(2020, 6, 5, 12, 35, 20),
        sender: "jprr44"
    },
    {
        conversationId: 1,
        type: 'message',
        body: "Voy",
        date: new Date(2020, 6, 5, 12, 44, 0),
        sender: "mau4duran"
    },
    {
        conversationId: 2,
        type: 'message',
        body: "Voy",
        date: new Date(2020, 6, 5, 12, 44, 0),
        sender: "mau4duran"
    },

    {
        conversationId: 3,
        type: 'message',
        body: "qué pedo",
        date: new Date(2020, 6, 5, 10, 40, 0),
        sender: "jsfran"
    },

    {
        conversationId: 4,
        type: 'message',
        body: "heyyy",
        date: new Date(2020, 6, 5, 19, 40, 0),
        sender: "jsfran"
    },
    {
        conversationId: 4,
        type: 'leave-conversation',
        body: "",
        date: new Date(),
        sender: "mau4duran"
    }
];

const getDummyMessages = () => {
    return dummyMessages;
}

const updateDummyMessages = (messages) => {
    dummyMessages = messages;
}

module.exports = {
    getDummyMessages,
    updateDummyMessages
};
