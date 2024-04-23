const path = require("path");
const devicePathUpload = '/public/uploads/devices/'

// Import device model

const { 
    Device,
    Location,
    Supplier,
    User,
    Loan,
    Log,
    DeviceType
 } = require('../models/models.js')


module.exports.ShowLoanRecordPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        // Thực hiện truy vấn để lấy ra tất cả dữ liệu trong bảng LoanRecord, loại trừ các trường _id, __v và notes
        Loan.find({}, { _id: 0, __v: 0, notes: 0 })
        .populate('device', 'name')
        .populate('borrower', 'username')
        .sort({ _id: -1 }) // Sắp xếp theo _id giảm dần để lấy 20 phần tử cuối cùng
        .limit(20) 
        .then(records => {

            const formattedDevices = records.map((record) => {
                const device = record.device.name
                const username = record.borrower.username
                const borrowedAt =
                    record.borrowedAt instanceof Date
                        ? record.borrowedAt.toLocaleDateString("en-GB")
                        : record.borrowedAt;

                const actualReturnDate =
                    record.actualReturnDate instanceof Date
                        ? record.actualReturnDate.toLocaleDateString("en-GB")
                        : record.actualReturnDate;
                const transactionStatus = record.transactionStatus
                return {
                    device,
                    username,
                    borrowedAt,
                    actualReturnDate,
                    transactionStatus
                };
            });
            // console.log(formattedDevices);
            // res.render("./contents/report/loanRecord", {data: JSON.stringify(formattedDevices)})
            res.render("./contents/report/loanRecord.pug", {
                title: 'Home page',
                routes: {
                    'Trang chủ': '/',
                    'Thông tin thiết bị': '/device/report',
                    'Tạo thiết bị': '/device/create',
                    'Mượn thiết bị': '/device/loan',
                    'Trả thiết bị': '/device/return',
                    'Loan record': '/record/loanrecord'
                },
                data: JSON.stringify(formattedDevices)
            });
        })
        .catch(error => {
            console.error('Error fetching records:', error);
        });
    } catch(error) {
        res.status(400).json(
            {success: false}
        )
    }
}

module.exports.retrieveAllLoanRecordTable = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }
        
        const loanRecord = await Loan.find({}, { _id: 0, __v: 0, notes: 0 })
        .populate('device', 'name')
        .populate('borrower', 'username')
        .then(records => {
            const formattedDevices = records.map((record) => {
                const device = record.device.name
                const username = record.borrower.username
                const borrowedAt =
                    record.borrowedAt instanceof Date
                        ? record.borrowedAt.toLocaleDateString("en-GB")
                        : record.borrowedAt;

                const actualReturnDate =
                    record.actualReturnDate instanceof Date
                        ? record.actualReturnDate.toLocaleDateString("en-GB")
                        : record.actualReturnDate;
                const transactionStatus = record.transactionStatus
                return {
                    device,
                    username,
                    borrowedAt,
                    actualReturnDate,
                    transactionStatus
                };
            });

            res.status(200).json({
                success: 'true',
                data: formattedDevices
            })
        })
    } catch (error) {
        res.status(404)
    }
}