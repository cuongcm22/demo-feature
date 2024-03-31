const path = require("path");
const devicePathUpload = './uploads/devices/'

// Import device model
const Device = require("../models/deviceSchema.js");
const LoanRecord = require("../models/loanSchema.js");

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

module.exports.reportDevice = async (req, res, next) => {
    console.log("Get device routers".blue.bold);
    try {
        Device.find({})
            .then((devices) => {
                const formattedDevices = devices.map((device) => {
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
                    // Chuyển đổi createDate
                    const createDate =
                        device.createDate instanceof Date
                            ? device.createDate.toLocaleDateString("en-GB")
                            : device.createDate;
                    // Chuyển đổi updateDate
                    const updateDate =
                        device.updateDate instanceof Date
                            ? device.updateDate.toLocaleDateString("en-GB")
                            : device.updateDate;

                    return {
                        ...device._doc,
                        purchaseDate,
                        warrantyExpiry,
                        createDate,
                        updateDate,
                    };
                });

                // console.log(formattedDevices);
                res.render("./contents/report/reportDevice", {
                    formattedDevices: JSON.stringify(formattedDevices)
                });
            })
            .catch((err) => {
                console.error(err);
                // Xử lý lỗi nếu có
            });
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.createDevice = async (req, res, next) => {
    console.log("Create device routers".blue.bold);
    try {
        res.render("contents/device/createDevice");
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.createDeviceDB = async (req, res, next) => {
    try {
        const device = new Device({
            id: req.body.serialNumber,
            name: req.body.deviceName,
            type: req.body.deviceType,
            status:
                req.body.deviceStatus || Device.schema.path("status").default, // Sử dụng giá trị mặc định từ schema
            initStatus:
                req.body.deviceInitStatus ||
                Device.schema.path("initStatus").default, // Sử dụng giá trị mặc định từ schema
            imageUrl: devicePathUpload + req.files[0].filename,
            videoUrl: devicePathUpload + req.files[1].filename,
            location: req.body.deviceLocation,
            supplier: req.body.deviceSupplier,
            history: req.body.deviceHistory,
            purchaseDate: new Date(req.body.purchaseDate),
            warrantyExpiry: new Date(req.body.warrantyExpiry),
            createDate: Date.now(),
            updateDate: Date.now(),
        });
        await device
            .save()
            .then((result) => {
                console.log(result);
                console.log("Save device successfully!!!".bgBlue);
                // res.status(201).json({
                //     message: "New device has been create!",
                //     data: result,
                // });
                res.status(201).redirect('/device')
            })
            .catch((error) => {
                console.log('ID thiết bị đã tồn tại, vui lòng thử id khác'.red.bold);
                res.status(400).json({
                    message: error,
                    server: "This may you have create this device, try another ID",
                });
            });
    } catch (error) {
        res.status(404);
    }
};

module.exports.updateDeviceDB = async (req, res, next) => {
  console.log('Update device route'.yellow.bold)
  try {
    console.log(req.body);
    Device.findOneAndUpdate(
      { id: req.body.id }, // Điều kiện tìm kiếm - ở đây sử dụng trường id để tìm kiếm thiết bị cần cập nhật
      req.body, // Dữ liệu mới sẽ được cập nhật từ req.body
      { new: true, upsert: true } // Tùy chọn để trả về bản ghi mới sau khi cập nhật và tạo bản ghi mới nếu không tìm thấy
    ).then(updatedDevice => {
      console.log("Update device successfully!!!".bgYellow.bold);
      res.status(200).redirect('/device')
    }).catch(error => {
      res.status(401).json({
        message: "Xảy ra lỗi khi cập nhật thiết bị",
        error: error
      })
    })
  } catch (error) {
    res.status(401).json({
      message: error
    })
  }
}

module.exports.deleteDeviceDB = async (req, res, next) => {
    try {
        // console.log(req.body);
        LoanRecord.findOne({ deviceID: req.body.id, status: 'borrowed' })
        .then(existingLoanRecord => {
            if (existingLoanRecord) {
                console.log(existingLoanRecord);
                res.status(200).json({
                    success: false,
                    message: 'Delete device fail'
                })
            } else {
                LoanRecord.deleteOne({ deviceID: req.body.id }).then(result => {
                    console.log('Delete device in loanRecord table successfully!'.bgRed);
                }).catch(err => console.log(`Đã xảy ra lỗi khi xóa thiết bị trong bảng loanRecord ${req.body.id}`.yellow))
                Device.deleteOne({ id: req.body.id }).then(result => {
                    console.log('Delete device successfully!'.bgRed)
                }).catch(err => {console.log(`Đã xảy ra lỗi khi xóa thiết bị trong bảng device ${req.body.id}`.yellow)})
                res.status(200).json({
                    success: true,
                    message: 'Deleted device'
                })
            }
        })
    } catch (error) {
        res.status(401).json({
            message: error
        })
    }
}

module.exports.loanDevice = async (req, res, next) => {
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
            res.render("./contents/device/loanDevice", {
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
            res.render("./contents/report/loanRecord", {data: JSON.stringify(formattedDevices)})
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

module.exports.returnDevice = async (req, res, next) => {
    try {
        const username = req.user.username;
        LoanRecord.find({ username: username, status: 'borrowed' }, { _id: 0, __v: 0, notes: 0 })
        .then(records => {
            console.log(`Records with username ${username}`, records);
            const deviceIDs = records.map(record => record.deviceID);
            console.log(deviceIDs);
            res.render("./contents/device/returnDevice", {data: JSON.stringify(deviceIDs)})
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