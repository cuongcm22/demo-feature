const mongoose = require('mongoose');
const { User, DeviceType, Supplier, Location, Config } = require('./models/models');

mongoose.connect('mongodb://127.0.0.1:27017/CSVC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  try {
    // Example mock data
    const suppliersData = [
      { name: 'Supplier 1', address: '123 Supplier St', phone: '123-456-7890', email: 'supplier1@example.com' },
      { name: 'Supplier 2', address: '456 Supplier St', phone: '456-789-0123', email: 'supplier2@example.com' },
    ];

    const usersData = [
      { username: 'admin', fullname: 'Admin User', password: 'adminpass', email: 'admin@example.com', phone: '987-654-3210', role: 'admin', createdAt: new Date() },
      { username: 'moderator', fullname: 'Moderator User', password: 'modpass', email: 'moderator@example.com', phone: '789-012-3456', role: 'moderator', createdAt: new Date() },
    ];

    const locationsData = [
      { name: 'Location 1', description: 'First Location', address: '123 Location St' },
      { name: 'Location 2', description: 'Second Location', address: '456 Location St' },
    ];

    const deviceTypesData = [
      { name: 'Dụng cụ lâu bền', description: 'Dụng cụ lâu bền' },
      { name: 'Tài sản cố định', description: 'Tài sản cố định' },
    ];

    const configData = {
      depreciationRate: 0.1,
      settingSizeImg: { height: 1024, width: 768 },
      settingSizeVideo: { height: 720, width: 1280 },
    };

    // Insert mock data
    await Supplier.insertMany(suppliersData);
    await User.insertMany(usersData);
    await Location.insertMany(locationsData);
    await DeviceType.insertMany(deviceTypesData);
    await Config.create(configData);

    console.log('Mock data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting mock data:', err);
    mongoose.disconnect();
  }
});
