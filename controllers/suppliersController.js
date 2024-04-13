const { 
    Supplier
 } = require('../models/models.js')

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.showCreateSuppliersPage = async (req, res, next) => {
    try {
        res.render("./contents/suppliers/createSuppliers.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'Create Supplier': '/suppliers/create',
                'Update Supplier': '/suppliers/detail'
            }
        });
    } catch (error) {
        res.status(404)
    }
}

module.exports.addSuppliers = async (req, res, next) => {
    try {
        const supplier = new Supplier(req.body)
        await supplier
            .save()
            .then(result => {
                const handleResult = handleAlertWithRedirectPage('Thêm mới thành công!','/suppliers/detail')
                res.send(handleResult)
            })
    } catch (error) {
        res.status(404)
    }
}

module.exports.showDetailSuppliersPage = async (req, res, next) => {
    const suppliers = await Supplier.find();
    try {
        res.render("./contents/suppliers/detailSuppliers.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'Create Supplier': '/suppliers/create',
                'Update Supplier': '/suppliers/detail'
            },
            suppliers: JSON.stringify(suppliers),
        });
    } catch (error) {
        res.status(404)
    }
}

module.exports.updateSuppliers = async (req, res, next) => {
    try {
        console.log(req.body);
        // Tìm và cập nhật nhà cung cấp dựa trên name
        const updatedSupplier = await Supplier.findOneAndUpdate(
        { name: req.body.nameholder }, // Điều kiện tìm kiếm
        req.body, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!updatedSupplier) {
            return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp' });
        }

        const handleResult = handleAlertWithRedirectPage('Cập nhật thành công!','/suppliers/detail')
        return res.send(
            handleResult
        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
}

module.exports.deleteSuppliers = async (req, res, next) => {
    try {
        const deletedSupplier = await Supplier.deleteOne({ name: req.body.supplierName });
        res.status(200).json(
            success = true
        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
}