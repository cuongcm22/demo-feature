const express = require('express')
const router = express.Router()

const devicesController = require("../controllers/devicesController")

// Import multer
const uploadFile = require('../models/multerSetting')

router.get('/create', devicesController.createDevice)
router.post('/create', uploadFile.array('deviceUrlFile', 2), devicesController.createDeviceDB)
router.post('/update', devicesController.updateDeviceDB)
router.post('/delete', devicesController.deleteDeviceDB)
router.get('/report', devicesController.reportDevice)
router.get('/loan', devicesController.loanDevice)
router.post('/loan', devicesController.loanDeviceDB)

module.exports = router;