const express = require('express')
const router = express.Router()

const homeController = require("../controllers/homeController")
const uploadModule = require("../modules/uploadServer")
const upload = require("../modules/multerSetting")

router.get('/', homeController.homePage)
router.get('/404', homeController.errorPage)
router.post('/uploads', upload.single('file'), uploadModule.uploadFile)
router.get('/export', homeController.exportFileCSV)

module.exports = router;