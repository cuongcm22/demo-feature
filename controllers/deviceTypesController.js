const { 
    DeviceType
 } = require('../models/models.js')

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.showCreateDeviceTypesPage = async (req, res, next) => {
    try {
        res.render("./contents/deviceTypes/createDeviceTypes.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'Detail': '/device/report',
                'Create': '/device/create',
                'Loan': '/device/loan',
                'Return': '/device/return'
            }
        });
    } catch (error) {
        res.status(404)
    }
}

module.exports.addDeviceTypes = async (req, res, next) => {
    try {
        const deviceType = new DeviceType(req.body)
        await deviceType
            .save()
            .then(result => {
                const handleResult = handleAlertWithRedirectPage('Thêm mới thành công!','/devicetypes/detail')
                res.send(handleResult)
            })
    } catch (error) {
        res.status(404)
    }
}

module.exports.showDetailDeviceTypesPage = async (req, res, next) => {
    const deviceTypes = await DeviceType.find();
    try {
        res.render("./contents/deviceTypes/detailDeviceTypes.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'Detail': '/device/report',
                'Create': '/device/create',
                'Loan': '/device/loan',
                'Return': '/device/return'
            },
            deviceTypes: JSON.stringify(deviceTypes),
        });
    } catch (error) {
        res.status(404)
    }
}

module.exports.updateDeviceTypes = async (req, res, next) => {
    try {
        console.log(req.body);
        // Tìm và cập nhật nhà cung cấp dựa trên name
        const updateDeviceTypes = await DeviceType.findOneAndUpdate(
        { name: req.body.nameholder }, // Điều kiện tìm kiếm
        req.body, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!updateDeviceTypes) {
            return res.status(404).json({ error: 'Không tìm thấy loại thiết bị' });
        }

        const handleResult = handleAlertWithRedirectPage('Cập nhật thành công!','/devicetypes/detail')
        return res.send(
            handleResult
        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
}

module.exports.deleteDeviceTypes = async (req, res, next) => {
    try {
        const deleteDeviceType = await DeviceType.deleteOne({ name: req.body.deviceTypeName });
        res.status(200).json(
            success = true
        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
}