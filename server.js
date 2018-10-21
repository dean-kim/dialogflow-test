const secret = require('./secret.json');
const apiai = require('apiai')(secret.apiaiKey);

const express = require('express');
const app = express();
const server = app.listen(5050);
const io = require('socket.io').listen(server);


io.on('connection', (socket) => {
    socket.on("userAudio", text => {

        // send text to AI here!
        // capture what the user just said in a userTextToSendToAI
        const userTextToSendToAI = text;

        // send string to AI for processing
        const AIReq = apiai.textRequest(userTextToSendToAI, {
            sessionId: secret.sessionId
        });

        // wait for and capture response from AI
        AIReq.on('response', (response) => {
            const AIResponse = response.result.fulfillment.speech;

            // use sockets to emit AIResponse to client here!
            socket.emit('AIResponse', AIResponse)
        });

        // about error
        AIReq.on('error', (error) => {
            console.log(error)
        });

        AIReq.end();
    });
});



