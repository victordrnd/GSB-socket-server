const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {origins : ['http://localhost:4200', "*:*"], transports : ['polling', 'flashsocket']});

let connectedUsers = [];

io.on("connection", socket => {
    console.log('new connection');
    
    
    socket.on('user.login', user => {
        getActiveUsers().indexOf(user.id) ? getActiveUsers().push(user.id) : console.log('User already online');
        console.log('login');
        socket.broadcast.emit('users.connected', getActiveUsers());
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

    socket.on('frais.status_change', data => {
        socket.broadcast.emit('frais_status_change', {});
    })

    socket.on('users.connected', data => {
        socket.emit('users.connected', getActiveUsers());    
    });

    socket.on('user.disconnect', user => {
        console.log(user);
        console.log('A user has disconnected');
        let index = getActiveUsers().indexOf(user.id);
        if(index !== -1)
            getActiveUsers().splice(index, 1)
        socket.broadcast.emit('users.connected', getActiveUsers());
    });
});


function getActiveUsers(){
    return connectedUsers;
}
http.listen(process.env.PORT || 3000);