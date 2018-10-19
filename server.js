const secret = require('./secret.json');

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
server.listen(5000);

const apiai = require('apiai')(secret["apiaiKey"]);
const io = require('socket.io')(server);
// const app = require('express')();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on("userAudio", text => {

        // send text to AI here!
        // capture what the user just said in a userTextToSendToAI
        const userTextToSendToAI = text.text;

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

        AIReq.on('error', (error) => {
            console.log(error)
        });

        AIReq.end();
    });
});



