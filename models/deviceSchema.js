const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  id: {type: String, unique: true, required: true},
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['new', 'likenew'], required: true , default: 'new' },
  initStatus: { type: String, enum: ['used', 'notused'], required: true , default: 'notused' },  
  imageUrl: { type: String },  
  videoUrl: { type: String },
  location: { type: String, required: true },
  supplier: { type: String },
  history: { type: String },
  purchaseDate: { type: Date, require: true},
  warrantyExpiry: { type: Date, require: true},
  createDate: { type: Date, require: true},
  updateDate: { type: Date, require: true},
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
