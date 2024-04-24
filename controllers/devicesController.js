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

function convertDatetoString(dateString) {
    // Parse the input date string
    const initialDate = new Date(dateString);
    
    // Add 4 days to the initial date
    const adjustedDate = new Date(initialDate.getTime() + (4 * 24 * 60 * 60 * 1000)); // Adding 4 days
    
    // Format the adjusted date to ISO 8601 format
    const isoDateString = adjustedDate.toISOString();
    
    // Return the ISO 8601 formatted date string
    return isoDateString;
}

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.ShowReportDevicePage = async (req, res, next) => {
    console.log("Get device routers".blue.bold);

    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype.name));
        const locations = await Location.find({}, 'name').then(locations => locations.map(location => location.name));
        const suppliers = await Supplier.find({}, 'name').then(suppliers => suppliers.map(supplier => supplier.name));

        await Device.aggregate([
            {
              $lookup: {
                from: 'devicetypes',
                localField: 'deviceType',
                foreignField: '_id',
                as: 'deviceType'
              }
            },
            {
              $unwind: '$deviceType'
            },
            {
              $lookup: {
                from: 'locations',
                localField: 'location',
                foreignField: '_id',
                as: 'location'
              }
            },
            {
              $unwind: '$location'
            },
            {
              $lookup: {
                from: 'suppliers',
                localField: 'supplier',
                foreignField: '_id',
                as: 'supplier'
              }
            },
            {
              $unwind: '$supplier'
            },
            {
              $project: {
                serialNumber: 1,
                name: 1,
                'deviceType.name': 1,
                status: 1,
                initStatus: 1,
                imageUrl: 1,
                videoUrl: 1,
                'location.name': 1,
                'supplier.name': 1,
                description: 1,
                purchaseDate: 1,
                warrantyExpiry: 1,
                createDate: 1
              }
            }
        ]).then((devices) => {
            res.render("./contents/report/reportDevice.pug", {
                title: 'Thiết bị',
                routes: {
                    'Trang chủ': '/',
                    'Thông tin thiết bị': '/device/report',
                    'Tạo thiết bị': '/device/create',
                    'Mượn thiết bị': '/device/loan',
                    'Đã mượn': '/device/return',
                    'Loan record': '/record/loanrecord'
                },
                formattedDevices: JSON.stringify(devices),
                devicetypes: JSON.stringify(devicetypes),
                locations: JSON.stringify(locations),
                suppliers: JSON.stringify(suppliers)
            });
        })
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.showCreateDevicePage = async (req, res, next) => {
    console.log("Create device routers".blue.bold);
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype.name));
        const locations = await Location.find({}, 'name').then(locations => locations.map(location => location.name));
        const suppliers = await Supplier.find({}, 'name').then(suppliers => suppliers.map(supplier => supplier.name));

        res.render("./contents/device/createDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Trang chủ': '/',
                'Thông tin thiết bị': '/device/report',
                'Tạo thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Đã mượn': '/device/return',
                'Loan record': '/record/loanrecord'
            },
            devicetypes: devicetypes,
            locations: locations,
            suppliers: suppliers
        });
           
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.createDeviceDB = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const deviceType = await DeviceType.find({name: req.body.deviceType})
        const location = await Location.find({name: req.body.location});
        const supplier = await Supplier.find({name: req.body.supplier});
        const data = {
            ...req.body,
            initStatus: 'notUsed',
            deviceType: deviceType[0],
            location: location[0],
            supplier: supplier[0],
            createDate: Date.now()
        }

        const device = new Device(data)
        await device
            .save()
            .then((result) => {
                console.log(result);
                console.log('Lưu thiết bị thành công'.blue.bold);
                const handleReturn = handleAlertWithRedirectPage('Lưu thiết bị thành công!','/device/report')
                res.send(handleReturn)
            })
            .catch((error) => {
                console.log(error);
                console.log('ID thiết bị đã tồn tại, vui lòng thử id khác'.red.bold);
                const handleReturn = handleAlertWithRedirectPage('Đã xảy ra lỗi khi thêm thiết bị, có thể id thiết bị đã tồn tại, vui lòng thử lại!','/device/create')
                res.send(handleReturn);
            });
    } catch (error) {
        res.status(404);
    }
};

module.exports.updateDeviceDB = async (req, res, next) => {
  console.log('Update device route'.yellow.bold)
  try {
    const { role } = req.userId;

    if (role != 'admin' && role != 'moderator') {
        return res.redirect('/404')
    }
    
    const deviceType = await DeviceType.find({name: req.body.deviceType})
    const location = await Location.find({name: req.body.location});
    const supplier = await Supplier.find({name: req.body.supplier});
    const data = {
        ...req.body,
        deviceType: deviceType[0],
        location: location[0],
        supplier: supplier[0]
    }

    Device.findOneAndUpdate(
      { serialNumber: req.body.serialNumber }, // Điều kiện tìm kiếm - ở đây sử dụng trường id để tìm kiếm thiết bị cần cập nhật
      data, // Dữ liệu mới sẽ được cập nhật từ req.body
      { new: true, upsert: true } // Tùy chọn để trả về bản ghi mới sau khi cập nhật và tạo bản ghi mới nếu không tìm thấy
    ).then(updatedDevice => {console.log("Update device successfully!!!".bgYellow.bold);
        const handleReturn = handleAlertWithRedirectPage('Cập nhật thiết bị thành công!','/device/report')
        res.send(handleReturn)
    })
    .catch(error => {res.status(401).json({
        message: "Xảy ra lỗi khi cập nhật thiết bị",
        error: error
      })})

  } catch (error) {
    res.status(401).json({
      message: error
    })
  }
}

module.exports.deleteDeviceDB = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        Device.deleteOne({ serialNumber: req.body.serialNumber }).then(result => {
            console.log('Delete device successfully!'.bgRed)
        }).catch(err => {console.log(`Đã xảy ra lỗi khi xóa thiết bị trong bảng device ${req.body.id}`.yellow)})
        res.status(200).json({
            success: true,
            message: 'Deleted device'
        })
    } catch (error) {
        res.status(401).json({
            message: error
        })
    }
}

// module.exports.ShowLoanDevicePage = async (req, res, next) => {
//     try {
//         console.log('Show loan device page route');
//         const { role } = req.userId;

//         if (role != 'admin' && role != 'moderator') {
//             return res.redirect('/404')
//         }

//         // const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype.name));
        
//         // // Lấy danh sách tất cả các thiết bị và populate tên loại thiết bị
//         // const devices = await Device.find({initStatus: 'notUsed'})
//         //     // Phương thức populate() của Mongoose được sử dụng để thực hiện việc populate (nạp dữ liệu) từ một collection khác (trong trường hợp này là DeviceType)
//         //     .populate('deviceType', 'name')
//         //     .populate('location', 'name')
//         //     .populate('supplier', 'name')
        
//         // // Chuyển đổi cấu trúc của deviceType thành object chỉ chứa trường name
//         // const formattedDevices = devices.map(device => ({
//         //     ...device.toObject(),
//         //     deviceType: device.deviceType.name,
//         //     location: device.location.name,
//         //     supplier: device.supplier.name
//         // }));

//         // res.render("./contents/device/loanDevice.pug", {
//         //     title: 'Thiết bị',
//         //     routes: {
//         //         'Trang chủ': '/',
//         //         'Thông tin thiết bị': '/device/report',
//         //         'Tạo thiết bị': '/device/create',
//         //         'Mượn thiết bị': '/device/loan',
//         //         'Đã mượn': '/device/return',
//         //         'Loan record': '/record/loanrecord'
//         //     },
//         //     data: JSON.stringify(formattedDevices),
//         //     deviceTypes: JSON.stringify(devicetypes)
//         // });

//     } catch (error) {
//         res.status(401).json({
//             message: error
//         })
//     }
// }

module.exports.ShowLoanDevicePage = async (req, res, next) => {
    try {
            
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype.name));

        // Khai báo các biến cần sử dụng
        let arrDevicesNotUsed, arrDevicesUsed, arrDeviceReturned, Data;

        // Câu truy vấn 1: Lọc ra tất cả các thiết bị với trạng thái notUsed
        arrDevicesNotUsed = await Device.find({ initStatus: 'notUsed' })
            .populate('deviceType', 'name')
            .populate('location', 'name')
            .populate('supplier', 'name')

        // Câu truy vấn 2: Lọc ra tất cả các thiết bị với trạng thái Used
        arrDevicesUsed = await Device.find({ initStatus: 'used' });

        // Câu truy vấn 3: Lấy ra tất cả các deviceId trong bảng loan dựa trên arrDevicesUsed với trạng thái returned
        const deviceIdsUsed = arrDevicesUsed.map(device => device._id);
        arrDeviceReturned = await Loan.distinct('device', { device: { $in: deviceIdsUsed }, transactionStatus: 'Returned' })
            .populate('deviceType', 'name')
            .populate('location', 'name')
            .populate('supplier', 'name')

        // Câu truy vấn 4: Ghép 2 arrDevicesNotUsed và arrDeviceReturned
        Data = [...arrDevicesNotUsed, ...arrDeviceReturned];

        const formattedDevices = Data.map(device => ({
            ...device.toObject(),
            deviceType: device.deviceType.name,
            location: device.location.name,
            supplier: device.supplier.name
        }));

        res.render("./contents/device/loanDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Trang chủ': '/',
                'Thông tin thiết bị': '/device/report',
                'Tạo thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Đã mượn': '/device/return',
                'Loan record': '/record/loanrecord'
            },
            data: JSON.stringify(formattedDevices),
            deviceTypes: JSON.stringify(devicetypes)
        });

    } catch (error) {
        res.status(401).json({
            message: error
        });
    }
}

module.exports.loanDeviceDB = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        // Using inherited variable from authenServer
        const userId = req.userId;
        
        const { deviceId, expectedReturnDate } = req.body;
        const adjustedDateString = convertDatetoString(expectedReturnDate);
        
        let deviceObject = await Device.findOne({ serialNumber: deviceId })

        // Task 3: Check if the device is already borrowed
        const existingLoan = await Loan.findOne({ device: deviceObject, transactionStatus: 'Borrowed' })
        
        if (existingLoan) {
            return res.status(200).json({ success: false, message: 'Device is already borrowed' });
        }
        
        // Task 5: Update device status from notUsed to Used based on deviceId
        deviceObject.initStatus = 'used';
        await deviceObject.save();
        
        // Task 6: Get all idRecord from loan table and save them in increasing order, initialize idRecord to 1 if not exists
        const latestLoan = await Loan.findOne().sort({ idRecord: -1 });
        let nextIdRecord = 1;
        if (latestLoan) {
            nextIdRecord = latestLoan.idRecord + 1;
        }

        // Task 7: Save all information into loan table
        const newLoan = new Loan({
            idRecord: nextIdRecord,
            device: deviceObject,
            borrower: userId,
            borrowedAt: new Date(),
            expectedReturnDate: adjustedDateString,
            transactionStatus: 'Borrowed'
        });
        
        await newLoan.save();

        res.status(200).json({ success: true, message: 'Loan request processed successfully' });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.ShowReturnDevicePage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype.name));

        const userId = req.userId;
        
        const loans = await Loan.find({ borrower: userId, transactionStatus: 'Borrowed' }).then(loans => loans.map(loan => loan.device));
        
        // Tìm kiếm dựa trên mảng
        const devices = await Device.find({ _id: { $in: loans } })
                .populate('deviceType', 'name')
                .populate('location', 'name')
                .populate('supplier', 'name')
        
        const formattedDevices = devices.map(device => ({
            ...device.toObject(),
            deviceType: device.deviceType.name,
            location: device.location.name,
            supplier: device.supplier.name
        }));
        
        res.render("./contents/device/returnDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Trang chủ': '/',
                'Thông tin thiết bị': '/device/return',
                'Tạo thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Đã mượn': '/device/return',
                'Loan record': '/record/loanrecord'
            },
            data: JSON.stringify(formattedDevices),
            deviceTypes: JSON.stringify(devicetypes)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports.returnDeviceDB = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }
        
        const userId = req.userId;

        const { deviceId } = req.body
        
        const device = await Device.findOneAndUpdate(
            { serialNumber: deviceId },
            { $set: { initStatus: 'notUsed' } },
            { new: true }
        )
        
        if (!device) {
            return res.status(200).json({ success: false, message: 'Device not found' });
        }  

        const loan = await Loan.findOneAndUpdate(
            { borrower: userId, device: device, transactionStatus: 'Borrowed' },
            { $set: { transactionStatus: 'Returned', actualReturnDate: new Date() } },
            { new: true }
        )
        
        if (!loan) {
            return res.status(200).json({ success: false, message: 'Loan not found' });
        }  

        res.status(200).json({
            success: true
        })

    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
}
