const express = require("express");
const app = express();

// Import các module cần thiết
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Connect mongodb
const mongodb = require('./models/connectDB')
mongodb()

// Setting static folder
app.use(express.static('public'));

// ==== Thiết lập Pug là công cụ mẫu cho Express ====
app.set('view engine', 'pug'); // Sử dụng Pug làm công cụ mẫu
app.set('views', './views'); // Đặt thư mục chứa các mẫu Pug

// Middleware cho bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Color
const colors = require('colors');

// Import routers
const deviceRouter = require('./routers/device.route')

// app.use("/", (req, res) => {
//     // Khi truy cập trang chủ, render tệp mẫu "index.pug"
//     res.render('index');
// });

app.use("/device", deviceRouter);

// Kết nối tới cổng máy chủ
const PORT = process.env.PORT || 3200; // Sử dụng cổng mặc định 3100 nếu không được chỉ định
app.listen(PORT, () => console.log(`Máy chủ đang chạy trên cổng ${PORT}`));
