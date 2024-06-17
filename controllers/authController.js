const path = require("path");
const jwt = require('jsonwebtoken')

// Import device model
// const User = require("../models/usersSchema.js");
const { User, Config } = require('../models/models')

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
        const { fullname, username, email, phone, role } = req.userId

        let routesTemp;

        const roleUserId = req.userId.role
        if (roleUserId != 'admin') {
            routesTemp = {
                'Về trang chủ': '/',
                'Trang thông tin người dùng': '/user/login'
            }
        } else {
            routesTemp = {
                'Về trang chủ': '/',
                'Quản trị viên': '/user/manage',
                'Đăng nhập': '/user/login',
                'Đăng ký': '/user/register'
            }
        }

        res.render("./contents/user/bioPage.pug", {
            title: 'Home page',
            routes: routesTemp,
            data: { fullname, username, email, phone, role }
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
                'Trang người dùng': '/user',
                'Đăng ký': '/user/register'
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

        var { email, password } = req.body
        
        email = email
        password = password
        
        // Lưu ý, cần phải đặt thời gian hết hạn token và cookie trùng nhau, tránh lỗi
        const expireTimeSession = 3000
        const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3000s",
        });

        await User.find({email: email, password: password}).then(user => {
            if (!user) {
                return res.status(200).json({
                    success: false
                })
            }

            const fullname = encodeURIComponent(user[0].fullname);
            // console.log(`User ${user[0].username} just login!`.bgBlue);

            const sessionId = `sessionId=${req.sessionID}; Max-Age=${expireTimeSession}; HttpOnly; SameSite=Strict; Path=/`;
            const sessionUserName = `sessionUserName=${fullname}; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;
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
                'Đăng nhập': '/user/login',
                'Đăng ký': '/user/register'
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
    const { fullname, username, password, email, phone } = req.body;

    try {
        // Create a new user instance
        const newUser = new User({
        fullname: fullname,
        username: username.toLowerCase(),
        password: password,
        email: email,
        phone: phone,
        role: 'guest', // Assuming default role is 'user',
        createdAt: Date.now()
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        const handleReturn = handleAlertWithRedirectPage('Đăng kí thành công!', '/user/login')
        res.send(handleReturn)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.logOut = async (req, res, next) => {
    try {
        const expireTimeSession = 1
        const sessionId = `sessionId=''; Max-Age=${expireTimeSession}; HttpOnly; SameSite=Strict; Path=/`;
        const sessionUserName = `sessionUserName=''; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;
        const sessionToken = `token=''; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;
    
        res.setHeader('Set-Cookie', [sessionId, sessionUserName, sessionToken]);
    
        const handleReturn = handleAlertWithRedirectPage('Đăng xuất thành công!', '/')
        res.send(handleReturn)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.ShowManageUserPage = async (req, res, next) => {
    try {
        const roleUserId = req.userId.role
        if (roleUserId != 'admin') {
            return res.redirect('/404')
        }

        const users = await User.find({}, { _id: 0, __v: 0 })

        res.render("./contents/admin/manageUser.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'Login': '/user/login',
                'Register': '/user/register'
            },
            data: JSON.stringify(users)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.manageUserDB = async (req, res, next) => {
    try {
        const roleUserId = req.userId.role

        if (roleUserId != 'admin') {
            return res.redirect('/404')
        }
        // console.log(req.body);
        const { username, fullname, email, password, phone, role } = req.body
        // console.log({ username, fullname, email, password, phone, role });
        const updatedUser = await User.findOneAndUpdate({username: username}, 
            {$set: {
                fullname: fullname,
                email: email,
                password: password,
                phone: phone,
                role: role
            }}
            , {
            new: true
        });

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true
        })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


module.exports.ShowConfigPage = async (req, res, next) => {
    try {
        const roleUserId = req.userId.role
        if (roleUserId != 'admin') {
            return res.redirect('/404')
        }

        const configSchema = await Config.findOne({}, { _id: 0, __v: 0 });

        res.render("./contents/admin/configSetting.pug", {
            title: 'Config',
            routes: {
                'Home': '/',
                'Login': '/user/login',
                'Register': '/user/register'
            },
            configSetting: configSchema
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.saveConfig = async (req, res, next) => {
    try {
        const roleUserId = req.userId.role
        if (roleUserId != 'admin') {
            return res.redirect('/404')
        }
        
        const { depreciationRate, settingSizeImg, settingSizeVideo } = req.body;

        // Kiểm tra tỷ lệ khấu hao
        if (0 < depreciationRate && depreciationRate < 1) {}
        else {return  res.status(200).json({
            success: false
        })}
        console.log(depreciationRate, settingSizeImg, settingSizeVideo );
        const updatedConfig = await Config.findOneAndUpdate(
            {},
            {
              depreciationRate,
              settingSizeImg,
              settingSizeVideo
            },
            {
              new: true, // Trả về tài liệu đã cập nhật
              upsert: true // Tạo mới nếu không tìm thấy
            }
        ).then(() => {
            res.status(200).json({
                success: true
            })
        }).catch(err => {
            res.status(200).json({
                success: false
            })
        })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

