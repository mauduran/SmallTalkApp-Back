const express = require('express');
const router = express.Router();

const dummyConversations = require('../Dummies/dummyConversations');


router.route('/')
    .post((req, res) => {
        console.log(req.body);
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


        res.json(newConversation);

    });

router.route('/:username')
    .get((req, res) => {
        const conversations = dummyConversations.getDummyConversations().sort((a, b) => {
            return b.lastMessage.date - a.lastMessage.date;
        });

        res.json(conversations.filter(el => el.members && el.members.includes(req.params.username)));

    });


router.route('/:conversationId/updatetitle')
    .put((req, res) => {
        let conversationId = req.params.conversationId;

        const title = req.body.title;

        if (!title) return res.status(400).json('No title was provided.');

        let convo = dummyConversations.getDummyConversations().find(el =>  el.conversationId == conversationId);

        console.log(convo)
        if (convo) {
            convo.title = title;
            return res.json(title);
        }
        res.status(400).json('Unexisting conversation Id.');

    });




module.exports = router; 