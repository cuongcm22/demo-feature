const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/NCKHDeviceManage');
    console.log('Đã kết nối đến MongoDB'.green.bold);
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
  }
};

module.exports = connectToMongoDB;
