const mongoose = require('mongoose');
const { User, DeviceType, Supplier, Location, Config } = require('./models/models');

async function addMockData() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/CSVC');
        const configData = {
            depreciationRate: 10,
            settingSizeImg: {
                height: 300,
                width: 400
            },
            settingSizeVideo: {
                height: 300,
                width: 400
            }
        };

        // Create a new config instance
        const newConfig = new Config(configData);

        // Save the new config to the database
        const savedConfig = await newConfig.save();
        console.log('Config data added successfully:', savedConfig);
        // Add mock device types
        const deviceTypes = [
            { name: 'Laptop', description: 'Portable computers' },
            { name: 'Smartphone', description: 'Mobile phones with advanced features' },
            { name: 'Tablet', description: 'Portable touchscreen devices' }
        ];
        await DeviceType.insertMany(deviceTypes);

        // Add mock suppliers
        const suppliers = [
            { name: 'Supplier A', address: '123 Supplier St, City', phone: '123-456-7890', email: 'supplierA@example.com' },
            { name: 'Supplier B', address: '456 Supplier Ave, Town', phone: '987-654-3210', email: 'supplierB@example.com' }
        ];
        await Supplier.insertMany(suppliers);

        // Add mock locations
        const locations = [
            { name: 'Building A', description: 'Main building', address: '789 Main St, Downtown' },
            { name: 'Warehouse B', description: 'Storage facility', address: '321 Warehouse Ave, Industrial Zone' }
        ];
        await Location.insertMany(locations);

        console.log('Mock data added successfully!');
    } catch (error) {
        console.error('Error adding mock data:', error);
    } finally {
        mongoose.connection.close();
    }
}

addMockData();
