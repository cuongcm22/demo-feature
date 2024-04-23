const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { stringify } = require('uuid');
// Ensure public/csv directory exists, create it if not
const csvDir = path.join(__dirname, '../assets/public/csv');
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true });
}

const { 
    Device,
    Location,
    Supplier,
    User,
    Loan,
    Log,
    DeviceType
 } = require('../models/models.js')

// Module
const { exportFileCSV } = require('../modules/exportFileCSV');
const { sendEmail } = require('../modules/sendEmail')

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
        res.render("./contents/home/home.pug", {
            title: 'Trang chủ',
            routes: {
                'Trang chủ': '/',
                'User': '/user',
                'Thiết bị': '/device/report',
                'Nhà cung cấp': '/suppliers/detail',
                'Vị trí': '/locations/detail',
                'Loại thiết bị': '/devicetypes/detail',
                'Loan record': '/record/loanrecord',
            }
        });
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}

module.exports.errorPage = async (req, res, next) => {
    try {
        res.render("error404", {
            title: 'Home page',
            routes: {
                'Trang chủ': '/'
            }});
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}

module.exports.showExportFileCSV = async (req, res, next) => {
    try {
        res.render("./contents/exportCSV.pug", {
            title: 'Home page',
            routes: {
                'Trang chủ': '/'
            },
            typesCSV: {
                'Supplier': 'Suppliers table',
                'Location': 'Locations table',
                'DeviceType': 'Device Types table',
            }
        });
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}

module.exports.exportFileCSV = async (req, res, next) => {
    try {
        async function getObjectList(req) {
            let csvFileName = ''; // Initialize csvFileName variable

            if (req.body) {
                if (req.body.csvFile == 'Supplier') {
                    const suppliers = await Supplier.find({}, { _id: 0, __v: 0 }).then(suppliers => suppliers.map(supplier => {return {...supplier._doc}}));
                    csvFileName = 'suppliers'; // Set corresponding CSV file name
                    return { data: suppliers, fileName: csvFileName }; // Return data and file name
                }
                else if (req.body.csvFile == 'Location') {
                    const locations = await Location.find({}, { _id: 0, __v: 0 }).then(locations => locations.map(location => {return {...location._doc}}));
                    csvFileName = 'locations'; // Set corresponding CSV file name
                    return { data: locations, fileName: csvFileName }; // Return data and file name
                }
                else if (req.body.csvFile == 'DeviceType') {
                    const deviceTypes = await DeviceType.find({}, { _id: 0, __v: 0 }).then(devicetypes => devicetypes.map(devicetype => {return {...devicetype._doc}}));
                    csvFileName = 'deviceTypes'; // Set corresponding CSV file name
                    return { data: deviceTypes, fileName: csvFileName }; // Return data and file name
                }
            }

            return { data: null, fileName: null }; // Return null if req.body is invalid or csvFile is not valid
        }

        let { data, fileName } = await getObjectList(req); // Await getObjectList to get the data and file name
        const outputPath = csvDir;
        console.log(typeof data);
        console.log(data);
        
        exportFileCSV(fileName, data, outputPath)
            .then((filePath) => {
                console.log('CSV file saved at:', filePath);
                // Return path of CSV file to client
                res.download(filePath);
            })
            .catch((err) => {
                console.error('Error saving CSV file:', err);
                res.status(500).send('An error occurred while processing the request.');
            });

    } catch(err) {
        console.log(err)
        res.status(404)
    }
}

module.exports.sendEmail = async (req, res, next) => {
    try {
        fs.readdir(csvDir, (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            const csvFiles = files.filter(file => file.endsWith('.csv'));
            res.render("./contents/sendEmail.pug", {
                title: 'Gửi mail',
                routes: {
                    'Trang chủ': '/'
                },
                filesnamecsv: csvFiles
            });
        });
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}