const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const formatMessage = require('./utils/messages');
const { userJoined, getCurrentUser, userLeft, getRoomUsers } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'ChatBot';

const PORT = 3000 || process.env.PORT
app.use(express.static(path.join(__dirname, 'public')))
//Run when client connects

io.on('connection', socket => {
    //join chatRoom 
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoined(socket.id, username, room);
        socket.join(user.room);


        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to chat'));//single client


        //broadcast when user connects
        socket.broadcast.to(user.room).emit('message',
            formatMessage(botName, `${user.username} has joined the chat`)); //all of clients except the client that connecting

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });



    // listen for chatMessage
    socket.on('chatMessage', (message) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, message));
    });

    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeft(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
        //send users and room info
       
    });

})

server.listen(PORT, () => console.log(`server running on port ${PORT}`))