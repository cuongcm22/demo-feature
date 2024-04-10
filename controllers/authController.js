const path = require("path");
const jwt = require('jsonwebtoken')

// Import device model
// const User = require("../models/usersSchema.js");
const { User } = require('../models/models')

const bcrypt = require('bcrypt');
const { match } = require("assert");

// Số vòng lặp sử dụng để băm mật khẩu, càng cao thì càng an toàn nhưng cũng tốn nhiều tài nguyên hơn
const saltRounds = 10;

async function hashPassword(password) {
    try {
        // Tạo salt (muối) ngẫu nhiên
        const salt = await bcrypt.genSalt(saltRounds);
        // Sử dụng salt để băm mật khẩu
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function comparePassword(password, hashedPassword) {
    try {
        // So sánh mật khẩu nhập vào với mật khẩu đã băm
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
}

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.showBioPage = async (req, res, next) => {
    try {
        res.render("./contents/user/bioPage.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'User': '/user/login',
                'Register': '/user/register'
            }
        });
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

module.exports.showLoginForm = async (req, res, next) => {
    try {
        
        res.render("./contents/user/loginForm.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'User': '/user',
                'Register': '/user/register'
            }
        });
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

module.exports.login = async (req, res, next) => {
    try {

        var { username, password } = req.body

        username = username.toLowerCase()
        password = password.toLowerCase()
        // Lưu ý, cần phải đặt thời gian hết hạn token và cookie trùng nhau, tránh lỗi
        const expireTimeSession = 3000
        const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3000s",
        });

        await User.find({'username': username}).then(user => {
            console.log(`User ${username} just login!`.bgBlue);

            const sessionId = `sessionId=${req.sessionID}; Max-Age=${expireTimeSession}; HttpOnly; SameSite=Strict; Path=/`;
            const sessionUserName = `sessionUserName=${username}; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;
            const sessionToken = `token=${accessToken}; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;

            res.setHeader('Set-Cookie', [sessionId, sessionUserName, sessionToken]);

            res.status(200).json({
                success: true,
                message: 'Login success'
            })
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

module.exports.showRegisterForm = async (req, res, next) => {
    try {
        res.render("./contents/user/registerForm.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'Login': '/user/login',
                'Register': '/user/register'
            }
        });
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

module.exports.register = async (req, res, next) => {
    // Parse data from req.body
    const { username, password, email, phone } = req.body;

    try {
        // Create a new user instance
        const newUser = new User({
        name: username,
        password: password,
        email: email,
        phone: phone,
        role: 'user', // Assuming default role is 'user',
        createdAt: Date.now()
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        res.status(201).json(savedUser); // Return the saved user in the response
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.logOut = async (req, res, next) => {
    const expireTimeSession = 1
    const sessionId = `sessionId=''; Max-Age=${expireTimeSession}; HttpOnly; SameSite=Strict; Path=/`;
    const sessionUserName = `sessionUserName=''; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;
    const sessionToken = `token=''; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;

    res.setHeader('Set-Cookie', [sessionId, sessionUserName, sessionToken]);

    const handleReturn = handleAlertWithRedirectPage('Đăng xuất thành công!', '/')
    res.send(handleReturn)
}