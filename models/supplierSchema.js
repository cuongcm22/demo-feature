const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    name: { type: String, unique: true, require: true },
    contactInfo: { type: String, require: true },
    address: { type: String, require: true },
    website: { type: String, require: true }
});

module.exports = mongoose.model('Supplier', SupplierSchema);