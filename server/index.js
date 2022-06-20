const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io')
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const Message = require('./models/Message');
const Room = require('./models/Room');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const roomRoutes = require('./routes/roomRoutes');


const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(adminRoutes);
app.use(roomRoutes);

const http = require('http').createServer(app);

const io = socketio(http, {
    allowEIO3: true,
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"]
    }
});
const mongoDB = "mongodb://localhost:27017/zaion_db";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected')).catch(err => console.log(err))
const { addUser, getUser, removeUser } = require('./util');

const PORT = process.env.PORT || 5000;


io.on('connection', (socket) => {
    Room.find().then(result => {
        socket.emit('output-rooms', result)
    })
    socket.on('create-room', ({ name, user_id }) => {
        const room = new Room({ name });
        room.users.push(user_id)
        room.save().then(result => {
            io.emit('room-created', result)
        })
    })
    socket.on('join-room', async ({ room_id, user_id }) => {
        const room = await Room.findById(room_id);
        if (room && room.users.length < 10) {
            room.users.push(user_id)
            room.save().then(result => {
                io.emit('room-joined', result)
            })
        }
    })

    socket.on('join', async ({ name, room_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            name,
            room_id,
            user_id
        })
        const room = await Room.findById(room_id)
        if (!room.users.includes(user_id)) {
            room.users.push(user_id)
            await room.save()
        }
        socket.join(room_id);
        if (error) {
            console.log('Error joining', error)
        } else {
            console.log('User joined successfully: ', user)
        }
    })
    socket.on('sendMessage', (message, room_id, callback) => {
        const user = getUser(socket.id);
        const msgToStore = {
            name: user.name,
            user_id: user.user_id,
            room_id,
            text: message
        }
        const msg = new Message(msgToStore);
        msg.save().then(result => {
            io.to(room_id).emit('message', result);
            callback()
        })

    })
    socket.on('get-messages-history', room_id => {
        Message.find({ room_id }).then(result => {
            socket.emit('output-messages', result)
        })
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    })
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});