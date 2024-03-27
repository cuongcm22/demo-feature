// Import device model
const Device = require("../models/deviceSchema.js");

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
            imageUrl: req.body.deviceUrlImg,
            videoUrl: req.body.deviceVideo,
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
        Device.deleteOne({ id: req.body.id }).then(result => {
            console.log('Delete device successfully!'.bgRed);
            res.status(200).json({
                message: `Delete device successfully! ${result}`
            })
        });
    } catch (error) {
        res.status(401).json({
            message: error
        })
    }
}
