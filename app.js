
const express = require("express");
const app = express();

// import .env
const dotenv = require('dotenv')
dotenv.config()

// Session
const session = require('express-session');

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));  

// Import các module cần thiết
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Connect mongodb
const mongodb = require('./models/db');

// Setting static folder
// Middleware để phục vụ các tệp tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'assets'), {
  // Cấu hình kiểu MIME cho tệp JavaScript
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// ==== Thiết lập Pug là công cụ mẫu cho Express ====
app.set('view engine', 'pug'); // Sử dụng Pug làm công cụ mẫu
app.set('views', './views'); // Đặt thư mục chứa các mẫu Pug

// Middleware cho bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Color
const colors = require('colors');

// Import routers
const homeRouter = require('./routers/home.route')
const deviceRouter = require('./routers/device.route')
const userRouter = require('./routers/user.route')
const supplierRouter = require('./routers/suppliers.route')
const locationRouter = require('./routers/locations.route')
const deviceTypesRouter = require('./routers/deviceTypes.route')

app.use("/", homeRouter)
app.use("/device", deviceRouter);
app.use("/user", userRouter)
app.use("/suppliers", supplierRouter)
app.use("/locations", locationRouter)
app.use("/devicetypes", deviceTypesRouter)

// Route demo
app.get("/demo", (req, res) => {
  res.render("./contents/demo/formValidate.pug", {
    title: 'Home page',
    routes: {
        'Home': '/',
        'Detail': '/device/report',
        'Create': '/device/create',
        'Loan': '/device/loan',
        'Return': '/device/return'
    }
});
})


// Kết nối tới cổng máy chủ
const PORT = process.env.PORT || 3200; // Sử dụng cổng mặc định 3100 nếu không được chỉ định
app.listen(PORT, () => console.log(`Máy chủ đang chạy trên cổng ${PORT}`));
