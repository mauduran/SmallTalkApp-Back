const express = require('express');
const router = express.Router();

const dummyMessages =  require('../Dummies/dummyMessages');

router.route('/:conversationId')
    .get((req, res) => {
        const messages = dummyMessages.getDummyMessages();

        res.json(messages.filter(message=>message.roomId==req.params.conversationId));
    });
module.exports = router; 