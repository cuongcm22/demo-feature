const path = require("path");

// Import device model
const User = require("../models/userSchema.js");

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

module.exports.userLogin = async (req, res, next) => {
    try {
        res.render("contents/user/loginForm")
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

module.exports.userLoginDB = async (req, res, next) => {
    try {
        await User.find({'username': req.body.username}).then(user => {
            // console.log(req.body.password, user[0].password)
            comparePassword(req.body.password, user[0].password).then(match => {
                if (match) {
                    res.status(200).json({
                        check: true,
                        message: 'Login success'
                    })
                } else {
                    res.status(401).json({
                        check: false,
                        message: 'Login fail'
                    })
                }
            })
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

module.exports.userRegister = async (req, res, next) => {
    try {
        res.render("contents/user/registerForm")
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

module.exports.userRegisterDB = async (req, res, next) => {
    try {

        // Lấy ra tất cả id hiện có
        const existingIds = await User.find({}, 'id');

        // Tạo mảng id hiện có
        const existingIdArray = existingIds.map(e => e.id);

        // Tìm id đầu tiên thiếu
        let newId = 1;
        while (existingIdArray.includes(newId)) {
            newId++;
        }

        const user = await User.create({
            id: parseInt(newId),
            username: req.body.username,
            password: `${await hashPassword(req.body.password)}`,
            studentID: req.body.studentID,
            email: req.body.email,
            phone: req.body.phone,
            role: 'user',
            createdAt: Date.now(),
            lastLogin: Date.now()
        }).then(result=> {
            console.log("New user has been create".bgBlue)
            console.log(result)
            res.status(200).json({
                check: true
            })
        }).catch(err => {
            console.error(err)
            res.status(401).json({
                check: false,
                message: err
            })
        })

    } catch (error) {
        console.error(error);
        res.status(404).json({
            check: false
        })
    }
}