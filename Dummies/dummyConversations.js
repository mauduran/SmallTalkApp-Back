let dummyConversations = [
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

const getDummyConversations = () => {
    return dummyConversations;
}

const updateDummyConversations = (conversations) => {
    dummyConversations = conversations;
}

module.exports = {
    getDummyConversations,
    updateDummyConversations
};