const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const mainRouter=require('./routes/main');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());




const server = () => {
   

    //Web Socket for continues updation and reduce overhead
    const server1 = http.createServer(app);
    const io = new Server(server1);

    io.on('connection', (socket) => {
        //Connects the user with userId can connect to socket
        socket.on('joinRoom', (userId) => {
            // user=userId;
            console.log("Connected");
            socket.join(userId)
        });

        socket.on('disconnect',()=>{
            console.log(`Disconnected user ${userId}`);
        })


    });
    const db = mongoose.connection;

    //All the initial operations will be done here like fetch user,repo,issue.
    db.once("open", async () => {
        console.log("CRUD");
    });

    app.use('/',mainRouter);
    main().catch(err => console.log(err));
    async function main() {
        await mongoose.connect(process.env.MONGO_URL);
    }
    server1.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
}
module.exports = server;




