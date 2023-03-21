const mongoose = require('mongoose');

const userSocketSchema = new mongoose.Schema({
    socketId: {
        type: String
    },
    userId: {
        type: String
    }
})

const UserSocket = mongoose.model('usersocket', userSocketSchema);

module.exports = UserSocket;