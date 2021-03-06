const redisUtils = require('./redis.utils');



const storeActiveUser = (socketId, userId) => {
    return redisUtils.addFieldToHashTable('activeUsers', '' + socketId, userId);
}

const storeActiveSocket = (userId, socketId) => {
    return redisUtils.addFieldToHashTable('activeSockets', '' + userId, socketId);
}

const storeUserSocket = (socketId, userId) => {
    if (!socketId || !userId) return
    return Promise.all([storeActiveUser(socketId, userId), storeActiveSocket(userId, socketId)])
        .then(vals => console.log(`Added Socket ${socketId}`))
        .catch(err=>console.log(err))
}


const removeActiveUser = (socketId) => {
    return redisUtils.removeFieldFromHashTable('activeUsers', '' + socketId);
}

const removeActiveSocket = (userId) => {
    return redisUtils.removeFieldFromHashTable('activeSockets', '' + userId);
}

const removeUserSocket = (socketId, userId) => {
    if (!socketId || !userId) return
    return Promise.all([removeActiveSocket(userId), removeActiveUser(socketId)])
        .then(vals => console.log(`Removed Socket ${socketId}`))
        .catch(error => console.log(error))
}

const getUserIdFromSocket = async (socketId) => {
    let userId;
    try {
        userId = redisUtils.getFieldFromHashTable('activeUsers', '' + socketId);
    } catch (error) {
        userId = null; 
    }
     
    return userId;
}

const getSocketIdFromUser = async (userId) => {
    let socketId;
    try {
        socketId = redisUtils.getFieldFromHashTable('activeSockets', '' + userId);
    } catch (error) {
        socketId = null; 
    }   
    return socketId;
}

const subscribeMembersToConversation = async (io, members) => {

    members.forEach(async (member) => {
        let socketId;
        try {
            socketId = await getSocketIdFromUser(member.username);
            socketId = socketId.data;
        } catch (error) {
            console.log("Error. Could not notify member of new conversation");
            return;
        }

        if(socketId){
            io.to(socketId).emit('newConversation', conversationId);
        }
    });
}

module.exports = {
    storeUserSocket,
    removeUserSocket,
    getUserIdFromSocket,
    getSocketIdFromUser,
    subscribeMembersToConversation
}