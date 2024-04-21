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

function convertTimerToString(time) {
    const purchaseDate = new Date(time);

    // Lấy ngày, tháng và năm từ purchaseDate
    const day = purchaseDate.getDate().toString().padStart(2, "0"); // Chuyển ngày thành chuỗi và đảm bảo có ít nhất 2 chữ số, nếu không thêm số 0 vào trước
    const month = (purchaseDate.getMonth() + 1).toString().padStart(2, "0"); // Chuyển tháng thành chuỗi và đảm bảo có ít nhất 2 chữ số, nếu không thêm số 0 vào trước
    const year = purchaseDate.getFullYear();

    // Tạo chuỗi mới với định dạng 'dd/mm/yyyy'
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
}

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
                    'Trả thiết bị': '/device/return'
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
                'Trả thiết bị': '/device/return'
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
    console.log(req.body);
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

module.exports.ShowLoanDevicePage = async (req, res, next) => {
    try {
        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype.name));
        
        // Lấy danh sách tất cả các thiết bị và populate tên loại thiết bị
        const devices = await Device.find({initStatus: 'notUsed'})
            // Phương thức populate() của Mongoose được sử dụng để thực hiện việc populate (nạp dữ liệu) từ một collection khác (trong trường hợp này là DeviceType)
            .populate('deviceType', 'name')
            .populate('location', 'name')
            .populate('supplier', 'name')

        // Chuyển đổi cấu trúc của deviceType thành object chỉ chứa trường name
        const formattedDevices = devices.map(device => ({
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
                'Trả thiết bị': '/device/return'
            },
            data: JSON.stringify(formattedDevices),
            deviceTypes: JSON.stringify(devicetypes)
        });

    } catch (error) {
        res.status(401).json({
            message: error
        })
    }
}

module.exports.loanDeviceDB = async (req, res, next) => {
    try {
        // Using inherited variable from authenServer
        const userId = req.user.username;
        const user = await User.findOne({ name: userId });
        const { deviceId, expectedReturnDate } = req.body;
        const adjustedDateString = convertDatetoString(expectedReturnDate);

        // Find device by serial number and update initStatus to 'used'
        const device = await Device.findOneAndUpdate(
            { serialNumber: deviceId },
            { $set: { initStatus: 'used' } },
            { new: true }
        );

        if (!device) {
            return res.status(404).json({ success: false, message: 'Device not found' });
        }

        // Create new loan object
        const newLoan = new Loan({
            device: device._id,
            borrower: user._id,
            borrowedAt: new Date(),
            expectedReturnDate: adjustedDateString,
            transactionStatus: 'Borrowed'
        });

        // Save the new loan
        await newLoan.save();

        // Send success response
        res.status(200).json({ success: true });
    } catch (error) {
        // Handle errors
        console.error('Error loaning device:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


module.exports.ShowReturnDevicePage = async (req, res, next) => {
    try {
        console.log('Return route!'.red);
        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype.name));
        
        const userId = req.user.username;
        const userObjectId = await User.findOne({ name: userId });
        const loans = await Loan.find({ borrower: userObjectId });
        // Array to store device information
        const devices = [];

        // Iterate through each loan and fetch device information
        for (const loan of loans) {
            // Find device information based on loan's device ID
            const device = await Device.findById(loan.device);

            // If device is found, push it to the devices array
            if (device) {
                devices.push(device);
            }
        }

        // Return array of device information
        console.log(devices);
        res.render("./contents/device/loanDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Trang chủ': '/',
                'Thông tin thiết bị': '/device/return',
                'Tạo thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Trả thiết bị': '/device/return'
            },
            data: JSON.stringify(devices),
            deviceTypes: JSON.stringify(devicetypes)
        });
        // LoanRecord.find({ username: username, status: 'borrowed' }, { _id: 0, __v: 0, notes: 0 })
        // .then(records => {
        //     console.log(`Records with username ${username}`, records);
        //     const deviceIDs = records.map(record => record.deviceID);
        //     console.log(deviceIDs);
        //     res.render("./contents/device/returnDevice.pug", {
        //         title: 'Home page',
        //         routes: {
        //             'Home': '/',
        //             'Detail': '/device/report',
        //             'Create': '/device/create',
        //             'Loan': '/device/loan',
        //             'Return': '/device/return'
        //         },
        //         data: JSON.stringify(deviceIDs)
        //     });
        // })
        // .catch(error => {
        //     console.error('Error fetching records:', error);
        //     res.status(401).json({
        //         message: 'Cant find device'
        //     })
        // });
    } catch (error) {
        
    }
}

module.exports.returnDeviceDB = async (req, res, next) => {
    try {
        const username = req.user.username;
        const { deviceId, returnDate } = req.body
        // Thực hiện câu lệnh truy vấn để cập nhật bản ghi trong bảng LoanRecord
        LoanRecord.findOneAndUpdate(
            { username: username, deviceID: deviceId }, // Điều kiện tìm kiếm
            { $set: { status: 'notborrowed', updated_at: new Date(returnDate) } }, // Dữ liệu cập nhật
            { new: true } // Tùy chọn để trả về bản ghi đã được cập nhật
        )
        .then(updatedRecord => {
            console.log('Updated record:', updatedRecord);
            res.status(200).send(
                `<script>
                    alert('Trả thiết bị thành công!')
                    window.location.assign(window.location.origin  + '/');
                </script>`
            )
        })
        .catch(error => {
            console.error('Error updating record:', error);
        });
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
}


module.exports.loanRecord = async (req, res, next) => {
    try {
        // Thực hiện truy vấn để lấy ra tất cả dữ liệu trong bảng LoanRecord, loại trừ các trường _id, __v và notes
        LoanRecord.find({}, { _id: 0, __v: 0, notes: 0 })
        .then(records => {
            console.log('All records:', records);

            const formattedDevices = records.map((record) => {
                // Chuyển đổi purchaseDate
                const borrowedAt =
                    record.borrowedAt instanceof Date
                        ? record.borrowedAt.toLocaleDateString("en-GB")
                        : record.borrowedAt;
                // Chuyển đổi warrantyExpiry
                const returnedAt =
                    record.returnedAt instanceof Date
                        ? record.returnedAt.toLocaleDateString("en-GB")
                        : record.returnedAt;
                // Chuyển đổi createDate
                const created_at =
                    record.created_at instanceof Date
                        ? record.created_at.toLocaleDateString("en-GB")
                        : record.created_at;
                // Chuyển đổi updateDate
                const updated_at =
                    record.updated_at instanceof Date
                        ? record.updated_at.toLocaleDateString("en-GB")
                        : record.updated_at;

                return {
                    ...record._doc,
                    borrowedAt,
                    returnedAt,
                    created_at,
                    updated_at,
                };
            });
            // console.log(formattedDevices);
            // res.render("./contents/report/loanRecord", {data: JSON.stringify(formattedDevices)})
            res.render("./contents/report/loanRecord.pug", {
                title: 'Home page',
                routes: {
                    'Home': '/',
                    'Detail': '/device/report',
                    'Create': '/device/create',
                    'Loan': '/device/loan',
                    'Return': '/device/return'
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