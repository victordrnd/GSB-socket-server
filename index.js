const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let connectedUsers = [];
io.on("connection", socket => {
    console.log('new connection');
    
    
    socket.on('user.login', user => {
        socket.broadcast.emit('users.connected', getActiveUsers());
        getActiveUsers().indexOf(user.id) ? getActiveUsers().push(user.id) : console.log('User already online');
        socket.once('disconnect', reason => {
            console.log('A user has disconnected');
            let index = getActiveUsers().indexOf(user.id);
            if(index !== -1)
                getActiveUsers().splice(index, 1)
            socket.broadcast.emit('users.connected', getActiveUsers());
        });
    });


    socket.on("frais.create", frais => {
        socket.broadcast.emit('frais_created', frais);
    });

    socket.on('users.connected', data => {
        socket.emit('users.connected', getActiveUsers());    
    })
});


function getActiveUsers(){
    return connectedUsers;
}
http.listen(4444, '0.0.0.0');