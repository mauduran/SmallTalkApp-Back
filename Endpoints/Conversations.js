const express = require('express');

const {getSocketIdFromUser} = require('../Utils/socket.utils')

const dummyConversations = require('../Dummies/dummyConversations');

const createConversation = (io) => async (req, res) => {
    let newId = -1;

    const convos = dummyConversations.getDummyConversations();
    convos.forEach(element => {
        if (element.conversationId > newId) newId = element.conversationId;
    });

    newId++;

    const newConversation = {
        ...req.body,
        conversationId: newId,
        lastMessage: {
            body: "",
            date: new Date(),
            sender: ""
        }
    }

    dummyConversations.updateDummyConversations([...convos, newConversation]);

    const {conversationId, members} = newConversation;


    members.forEach(async (member)=>{
        let socketId;
        try {
            socketId = await getSocketIdFromUser(member);
            socketId = socketId.data;
        } catch (error) {
            console.log("Error. Could not notify member of new conversation");
            return;
        }

        if(socketId){
            io.to(socketId).emit('newConversation', conversationId);
        }
    })

    res.json(newConversation);

};

const getUserConversations =  (req, res) => {
    const conversations = dummyConversations.getDummyConversations().sort((a, b) => {
        return b.lastMessage.date - a.lastMessage.date;
    });

    res.json(conversations.filter(el => el.members && el.members.includes(req.params.username)));

};



const updateConversationTitle = (io) => (req, res) => {
    let conversationId = req.params.conversationId;

    const title = req.body.title;

    if (!title) return res.status(400).json('No title was provided.');

    let convo = dummyConversations.getDummyConversations().find(el => el.conversationId == conversationId);

    if (convo) {
        convo.title = title;
        io.to(conversationId).emit('updateConversationTitle', conversationId);
        return res.json(title);
    }

    res.status(400).json('Unexisting conversation Id.');

};


module.exports = {
    getUserConversations,
    updateConversationTitle,
    createConversation
}; 