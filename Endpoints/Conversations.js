const express = require('express');
const router = express.Router();

const dummyConversations = require('../Dummies/dummyConversations');

router.route('/:username')
    .get((req, res)=>{
        const conversations = dummyConversations.getDummyConversations();

        res.json(conversations.filter(el=>el.members && el.members.includes(req.params.username)));

        
    });


module.exports = router; 