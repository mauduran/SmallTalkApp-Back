let activeUsers = {};
let activeSockets = {};

const getDummyActiveUsers = () => {
    return activeUsers;
}

const updateDummyActiveUsers= (users) => {
    activeUsers = users;
}

const getDummyActiveSockets = () => {
    return activeSockets;
}

const updateDummyActiveSockets= (sockets) => {
    activeSockets = sockets;
}


module.exports = {
    getDummyActiveUsers,
    updateDummyActiveUsers,
    getDummyActiveSockets,
    updateDummyActiveSockets
};
