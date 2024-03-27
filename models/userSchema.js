const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    studentID: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    role: { type: String, enum: ['admin', 'moderator', 'user'], require: true },
    createdAt: { type: Date, required: true },
    lastLogin: { type: Date, required: true }
});

module.exports = mongoose.model('User', UserSchema);