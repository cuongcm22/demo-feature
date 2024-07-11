
const mongoose = require('mongoose');
const { User, Config, Loan, Device } = require('./models/models');

async function register() {
    const { fullname, username, password, email, phone } = {
        fullname: 'Nguyễn Quang Lịch',
        username: 'lichnq',
        password: 'lichnq@@',
        email: 'lichnq@gmail.com',
        phone: '0325433454'
    };

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/CSVC');

        const newUser = new User({
            fullname: fullname,
            username: username.toLowerCase(),
            password: password,
            email: email,
            phone: phone,
            role: 'admin',
            createdAt: Date.now()
        });

        console.log(newUser);
        const savedUser = await newUser.save();
        console.log(`Tạo tài khoản ${fullname} thành công! `);
    } catch (error) {
        console.log(`Tạo tài khoản ${fullname} thất bại! `);
        console.log(error);
    } finally {
        mongoose.connection.close();
    }
}

register();
