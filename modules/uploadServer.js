const path = require("path");

var uploadDirectory = '/public/uploads/devices/';

module.exports.uploadFile = async (req, res, next) => {

    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const filePath = path.join(uploadDirectory, req.file.filename);

    // Construct URL for the uploaded file
    const fileUrl = uploadDirectory + `${req.file.filename}`;

    res.status(200).json({
        status: 'success',
        data: fileUrl
    })
}