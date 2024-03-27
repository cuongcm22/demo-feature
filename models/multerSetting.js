const multer = require('multer')
const path = require("path");

const devicePathUpload = '../public/uploads/devices/'

// Hoặc sử dụng path.join để kết hợp đường dẫn
const pathUpload = path.join(__dirname, devicePathUpload);

var uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathUpload);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const uploadFile = multer({
  dest: pathUpload,
  storage: uploadStorage,
})

module.exports = uploadFile
