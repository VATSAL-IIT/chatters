const express=require('express');
const app=express();
const path=require('path');
const socket=require('socket.io');
const PORT=process.env.PORT ||  3000

let socketsConnected=new Set();                              //creating new set


const server=app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
});

app.use(express.static(path.join(__dirname,'public')));                                                       //making the public folder as the static direfctory of our application.   //path package is used to add path of the public folder.
                                                             //since index.html is in the public folder which has been made the staic directory ,we dont need to create a route for that.It is compulsory that it should be named as index.html
                                                             
const io=socket(server);

io.on('connection',onconnected);                            //all the clients will be automatically reconnected which is a major advantage of the socket.io library


function onconnected(socket) 
{   
    console.log(socket.id);
    socketsConnected.add(socket.id);
    socket.on('disconnect',(socket)=>{
        console.log('socket disconnected',socket.id)
        socketsConnected.delete(socket.id,()=>{
            console.log("deleted");
        });
        // io.emit('clients-total',socketsConnected.size);
    })
    socket.emit('clients-total',socketsConnected.size)
    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message',data);                 //listening to message event of sending message by some user.The server emits the message received from one client to all the sockets and yb using broadcast property in this manner we ensure that the message is not emitted to the client who had initially sent the message.
    })
}

