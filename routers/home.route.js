const express = require('express')
const router = express.Router()

const homeController = require("../controllers/homeController")
const uploadModule = require("../modules/uploadServer")
const upload = require("../modules/multerSetting")
const moduleSendEmail = require('../modules/sendEmail')

router.get('/', homeController.homePage)
router.post('/uploads', upload.single('file'), uploadModule.uploadFile)
router.get('/404', homeController.errorPage)

// Route export csv file
router.get('/export', homeController.showExportFileCSV)
router.post('/export', homeController.exportFileCSV)

// Route send email
router.get('/sendemail', homeController.sendEmail)
router.post('/sendemailupload', moduleSendEmail.sendMail)

module.exports = router;