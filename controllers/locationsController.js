const { 
    Location
 } = require('../models/models.js')

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.showCreateLocationsPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const locations = await Location.find({}, 'name').then(location => location.map(location => location?.name));
        res.render("./contents/locations/createLocations.pug", {
            title: 'Vị trí',
            routes: {
                'Tạo vị trí': '/locations/create',
                'Sửa vị trí': '/locations/detail'
            },
            locations: JSON.stringify(locations)
        });
    } catch (error) {
        res.status(404)
    }
}

module.exports.addLocations = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const location = new Location(req.body)
        await location
            .save()
            .then(result => {
                res.status(200).json({
                    success: true
                })
            })
            .catch(error => {
                res.status(200).json({
                    success: false
                })
            })
    } catch (error) {
        res.status(404)
    }
}

module.exports.showDetailLocationsPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const locations = await Location.find()
            .sort({ _id: -1 }) // Sắp xếp theo _id giảm dần để lấy 20 phần tử cuối cùng
            .limit(20) 

        res.render("./contents/locations/detailLocations.pug", {
            title: 'Vị trí',
            routes: {
                'Tạo vị trí': '/locations/create',
                'Sửa vị trí': '/locations/detail'
            },
            locations: JSON.stringify(locations),
        });
    } catch (error) {
        res.status(404)
    }
}

module.exports.retrieveAllLocationsTable = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const locations = await Location.find();

        res.status(200).json({
            success: 'true',
            data: locations
        })
    } catch (error) {
        res.status(404)
    }
}

module.exports.updateLocations = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin') {
            return res.redirect('/404')
        }

        // Tìm và cập nhật nhà cung cấp dựa trên name
        const updateLocation = await Location.findOneAndUpdate(
        { name: req.body.nameholder }, // Điều kiện tìm kiếm
        req.body, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!updateLocation) {
            return res.status(404).json({ error: 'Không tìm thấy nơi lữu trữ' });
        }

        const handleResult = handleAlertWithRedirectPage('Cập nhật thành công!','/locations/detail')
        return res.send(
            handleResult
        )
    } catch (error) {
        console.error(error);
        return res.redirect('/')
    }
}

module.exports.deleteLocations = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin') {
            return res.status(200).json({
                success: false
            })
        }
        
        const deletedLocation = await Location.deleteOne({ name: req.body.locationName });
        res.status(200).json({
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
}