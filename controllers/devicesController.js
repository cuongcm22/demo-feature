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
                title: 'Home page',
                routes: {
                    'Home': '/',
                    'Detail': '/device/report',
                    'Create': '/device/create',
                    'Loan': '/device/loan',
                    'Return': '/device/return'
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
            title: 'Home page',
            routes: {
                'Home': '/',
                'Detail': '/device/report',
                'Create': '/device/create',
                'Loan': '/device/loan',
                'Return': '/device/return'
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
        await Device.aggregate([
            {
                $lookup: {
                    from: "loanrecords", // Tên bảng trong database
                    localField: "id",
                    foreignField: "deviceID",
                    as: "loanRecords"
                }
            },
            {
                $unwind: {
                    path: "$loanRecords",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        { "loanRecords": { $exists: false } }, // Trường hợp không có bản ghi trong loanrecords
                        { "loanRecords.status": "notborrowed" }// Trường hợp có bản ghi với status là notborrowed
                        // { "loanRecords.deviceID": "$id", "loanRecords.status": "notborrowed" }// Trường hợp có bản ghi với status là notborrowed
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    deviceID: "$id",
                    deviceName: "$name",
                    deviceImage: "$imageUrl",
                    deviceVideo: "$videoUrl",
                    deviceLocation: "$location",
                    deviceSupplier: "$supplier",
                }
            }
        ]).then(results => {
            console.log(results);
            // Xử lý kết quả ở đây
            res.render("./contents/device/loanDevice.pug", {
                title: 'Home page',
                routes: {
                    'Home': '/',
                    'Detail': '/device/report',
                    'Create': '/device/create',
                    'Loan': '/device/loan',
                    'Return': '/device/return'
                },
                data: JSON.stringify(results)
            });
        }).catch(err => {
            console.error(err);
            // Xử lý lỗi ở đây
            res.status(400).json({
                message: err
            })
        });

    } catch (error) {
        res.status(401).json({
            message: error
        })
    }
}

module.exports.loanDeviceDB = async (req, res, next) => {
    try {
        // using inherited variable from authenServer
        const username = req.user.username;
        console.log(req.body);
        // Kiểm tra xem có bản ghi nào với device id và trạng thái borrowed
        LoanRecord.findOne({ deviceID: req.body.deviceId, status: 'borrowed' })
        .then(existingLoanRecord => {
            if (existingLoanRecord) {
                // Nếu đã tồn tại bản ghi, có người dùng đã mượn thiết bị
                console.log('This device is already borrowed by another user:', existingLoanRecord);
                // Thực hiện các hành động phù hợp, ví dụ: trả về thông báo lỗi
                // res.status(400).send('This device is already borrowed by another user');
                res.send(
                    `<script>
                        alert('Thiết bị này đã có người mượn, vui lòng mượn thiết bị khác!')
                        window.location.assign(window.location.origin  + '/device/loan');
                    </script>`
                )
            } else {
                // Nếu không tìm thấy bản ghi, chưa có người dùng nào mượn thiết bị

                // Tiếp tục với việc cập nhật hoặc tạo mới bản ghi
                // ... Tiếp tục với code trong phần trước ...
                // Tìm bản ghi LoanRecord dựa trên username và deviceID
                LoanRecord.findOneAndUpdate(
                    { deviceID: req.body.deviceId }, // Điều kiện tìm kiếm
                    { $set: { 
                        username: username,
                        borrowedAt: new Date(req.body.loanDate),
                        returnedAt: new Date(req.body.returnDate),
                        status: 'borrowed',
                        updated_at: Date.now()
                    } }, // Dữ liệu cập nhật
                    { upsert: true, new: true } // Tạo mới nếu không tìm thấy
                )
                .then(loanRecord => {
                    if (loanRecord) {
                        // Nếu bản ghi đã tồn tại, cập nhật thông tin
                        console.log('Updated loan record:', loanRecord);
                        res.status(200).send(
                            `<script>
                                alert('Mượn thiết bị thành công!')
                                window.location.assign(window.location.origin  + '/');
                            </script>`
                        )
                    } else {
                        // Nếu bản ghi không tồn tại, tạo mới bản ghi
                        const loanRecordData = {
                            username: username,
                            deviceID: req.body.deviceId,
                            borrowedAt: new Date(req.body.loanDate),
                            returnedAt: new Date(req.body.returnDate),
                            status: 'borrowed',
                            created_at: Date.now(),
                            updated_at: Date.now()
                        };

                        // Tạo một bản ghi mới của LoanRecord và lưu vào cơ sở dữ liệu
                        const newLoanRecord = new LoanRecord(loanRecordData);
                        newLoanRecord.save()
                        .then(savedRecord => {
                            console.log('Loan record saved:', savedRecord);
                            // Thực hiện các thao tác tiếp theo nếu cần
                            res.status(200).send(
                                `<script>
                                    alert('Mượn thiết bị thành công!')
                                    window.location.assign(window.location.origin  + '/');
                                </script>`
                            )
                        })
                        .catch(error => {
                            console.error('Error saving loan record:', error);
                            // Xử lý lỗi nếu có
                            res.status(400).json({
                                message: error
                            })
                        });
                    }
                })
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Xử lý lỗi nếu có lỗi xảy ra trong quá trình thực hiện truy vấn
            res.status(500).send('Internal Server Error');
        });
        

    } catch (error) {
        res.status(401).json({
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

module.exports.showReturnDevicePage = async (req, res, next) => {
    try {
        const username = req.user.username;
        LoanRecord.find({ username: username, status: 'borrowed' }, { _id: 0, __v: 0, notes: 0 })
        .then(records => {
            console.log(`Records with username ${username}`, records);
            const deviceIDs = records.map(record => record.deviceID);
            console.log(deviceIDs);
            res.render("./contents/device/returnDevice.pug", {
                title: 'Home page',
                routes: {
                    'Home': '/',
                    'Detail': '/device/report',
                    'Create': '/device/create',
                    'Loan': '/device/loan',
                    'Return': '/device/return'
                },
                data: JSON.stringify(deviceIDs)
            });
        })
        .catch(error => {
            console.error('Error fetching records:', error);
            res.status(401).json({
                message: 'Cant find device'
            })
        });
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
