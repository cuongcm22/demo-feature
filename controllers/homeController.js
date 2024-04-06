const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// Ensure public/csv directory exists, create it if not
const csvDir = path.join(__dirname, '../assets/public/csv');
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true });
}

const Device = require("../models/deviceSchema.js");
const { exportFileCSV } = require('../modules/exportFileCSV');
const { stringify } = require('uuid');

function getStringDateTime() {
    const currentTime = Date.now();

    // Tạo một đối tượng Date từ Unix timestamp
    const currentDate = new Date(currentTime);

    // Lấy các thành phần ngày, tháng và năm
    const day = currentDate.getDate().toString().padStart(2, '0'); // Cần chú ý thêm padStart để thêm số 0 phía trước nếu cần
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0, cần thêm 1
    const year = currentDate.getFullYear();

    // Tạo chuỗi ngày tháng theo định dạng 'DD/MM/YYYY'
    const formattedDate = `${day}${month}${year}`;

    return formattedDate;
}

module.exports.homePage = async (req, res, next) => {
    try {
        res.render("./main", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'User': '/user/login',
                'Device': '/device/report',
                'Record loan': '/device/loanrecord',
            }
        });
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}

module.exports.errorPage = async (req, res, next) => {
    try {
        res.render("error404");
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}

module.exports.exportFileCSV = async (req, res, next) => {
    try {
        Device.find({}, { _id: 0, __v: 0, imageUrl: 0, videoUrl: 0, createDate: 0, updateDate: 0 })
            .then((devices) => {
                 // Convert the array of devices to a JSON object
                const devicesJson = devices.map(device => {
                    // Chuyển đổi purchaseDate
                    const purchaseDate =
                        device.purchaseDate instanceof Date
                            ? device.purchaseDate.toLocaleDateString("en-GB")
                            : device.purchaseDate;
                    // Chuyển đổi warrantyExpiry
                    const warrantyExpiry =
                        device.warrantyExpiry instanceof Date
                            ? device.warrantyExpiry.toLocaleDateString("en-GB")
                            : device.warrantyExpiry;
                    return {
                        ...device._doc,
                        purchaseDate,
                        warrantyExpiry
                    };
                });

                const data = devicesJson;

                const outputPath = csvDir;

                const dateTime = getStringDateTime()
                const title = 'Report device ' + dateTime

                exportFileCSV(title, data, outputPath)
                .then((filePath) => {
                    console.log('CSV file saved at:', filePath);
                    // Return path of CSV file to client
                    res.download(filePath);
                })
                .catch((err) => {
                    console.error('Error saving CSV file:', err);
                    res.status(500).send('An error occurred while processing the request.');
                });
            })
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}