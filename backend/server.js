const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mainRouter = require('./routes/main');
const connectDB = require('./db');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials:true,
    allowedHeaders:["Content-Type","Authorization"]
}));
app.use(express.json());

const startServer = async () => {
    await connectDB();

    const server1 = http.createServer(app);
    const io = new Server(server1);

    io.on('connection', (socket) => {
        socket.on('joinRoom', (userId) => {
            console.log("Connected");
            socket.join(userId);
        });

        socket.on('disconnect', () => {
            console.log(`Disconnected user`);
        });
    });

    app.use('/', mainRouter);

    server1.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

module.exports = startServer;
