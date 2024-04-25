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
                'Quản lý profile': '/user',
                'Quản lý thiết bị': '/device/report',
                'Quản lý nhà cung cấp': '/suppliers/detail',
                'Quản lý vị trí': '/locations/detail',
                'Quản lý loại thiết bị': '/devicetypes/detail',
                'Quản lý lịch sử mượn trả': '/record/loanrecord',
            }
        });
    } catch(err) {
        console.log(err)
        res.status(404)
    }
}

module.exports.showDashBoard = async (req, res, next) => {
    try {

        var arrDeviceIdsNotReturned = []

        let arrDeviceIdsUsed = await Device.find({ initStatus: 'used' }).then(device => device.map(device => device._id))

        // Thực hiện lượt qua tất cả các deviceIds có trong arrDeviceIdsUsed trong bảng loan table
        // Để kiểm tra thiết bị nào đã được trả
        const processDeviceId = async (deviceId) => {
            let arrDeviceIdsBorrowedReturn = await Loan.find({ device: deviceId });
            const arrDeviceIdsBorrowed = arrDeviceIdsBorrowedReturn
                .filter(item => item.transactionStatus == 'Borrowed')
                .map(item => item.device);
            const arrDeviceIdsReturned = arrDeviceIdsBorrowedReturn
                .filter(item => item.transactionStatus == 'Returned')
                .map(item => item.device);
            if (arrDeviceIdsBorrowed.length != arrDeviceIdsReturned.length) {
                arrDeviceIdsNotReturned.push(deviceId);
            }
        };

        await Promise.all(arrDeviceIdsUsed.map(processDeviceId));

        // ==== Task 1: Thống kê những thiết bị được mượn nhưng chưa được trả => done
        console.log('Thống kê những thiết bị được mượn nhưng chưa được trả');
        console.log('arrDeviceIdsNotReturned: ', arrDeviceIdsNotReturned.length);

        
        // ==== Task 2: Thống kê những người mượn quá hạn nhưng chưa trả
        //T1: Đầu tiên phải lấy ra được các thiết bị đã mượn nhưng chưa trả
        // => arrDeviceIdsNotReturned <= 

        // Sau đó tìm kiếm trong bảng loan với những deviceId này, những deviceId nào với expectedReturnDate < now
        
        let arrDeviceIdsDue;

        // Bước 1: Tìm kiếm và lọc các bản ghi trong bảng Loan dựa trên arrDeviceIdsNotReturned
        await Loan.aggregate([
            // Match records based on arrDeviceIdsNotReturned
            {
              $match: {
                device: { $in: arrDeviceIdsNotReturned }
              }
            },
            // Group by device, select the latest record based on idRecord
            {
              $group: {
                _id: "$device",
                latestRecord: { $max: "$idRecord" },
                records: { $push: "$$ROOT" }
              }
            },
            // Unwind the grouped records
            {
              $unwind: "$records"
            },
            // Match records with the latest idRecord
            {
              $match: {
                $expr: { $eq: ["$records.idRecord", "$latestRecord"] }
              }
            },
            // Filter overdue loans
            {
              $match: {
                "records.transactionStatus": "Borrowed",
                "records.expectedReturnDate": { $lt: new Date() }
              }
            },
            // Project to reshape the output documents
            {
              $project: {
                _id: "$records._id",
                idRecord: "$records.idRecord",
                device: "$records.device",
                borrower: "$records.borrower",
                borrowedAt: "$records.borrowedAt",
                expectedReturnDate: "$records.expectedReturnDate",
                actualReturnDate: "$records.actualReturnDate",
                transactionStatus: "$records.transactionStatus"
              }
            }
          ])
          .then(result => {
            // console.log(result);
            arrDeviceIdsDue = result
          })
          .catch(error => {
            console.error(error);
          });

        // ==== Task 3: Thống kê những thiết bị không còn hoạt động
        const arrDevice = []
        const arrDeviceNotWorking = [];

        await Device.find()
            .then(device => {
                device.map(device => {
                    if (device.status != 'Active') {
                        // console.log(device);
                        arrDeviceNotWorking.push(device)
                    } else {
                        arrDevice.push(device)
                    }
                })
            })
        console.log(arrDevice.length);
        console.log('arrDeviceNotWorking: ', arrDeviceNotWorking.length);

        res.render("./contents/dashboard/dashboard.pug", {
            data: {
                totalDevices: arrDevice.length,
                // Task 1: Thống kê những thiết bị được mượn nhưng chưa được trả || arrDeviceIdsNotReturned / totalDevices
                arrDeviceIdsNotReturned: arrDeviceIdsNotReturned.length,
                // Task 2: Thống kê những người mượn quá hạn nhưng chưa trả || arrDeviceIdsDue / arrDeviceIdsNotReturned
                arrDeviceIdsDue: arrDeviceIdsDue.length,
                // Task 3: Thống kê những thiết bị không còn hoạt động || arrDeviceNotWorking / totalDevices
                arrDeviceNotWorking: arrDeviceNotWorking.length
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