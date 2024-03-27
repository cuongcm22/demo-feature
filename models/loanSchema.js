// LoadRecord.js
const mongoose = require('mongoose');

const LoanRecordSchema = new mongoose.Schema({
    username: { type: String, require: true },
    deviceID: { type: String, require: true },
    borrowedAt: { type: Date, require: true },
    returnedAt: { type: Date, require: true },
    status: { type: String, enum: ['borrowed', 'notborrowed'], require: true },
    notes: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoanRecord', LoanRecordSchema);