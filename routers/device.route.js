const express = require('express')
const router = express.Router()

const devicesController = require("../controllers/devicesController")

// Import multer
const uploadFile = require('../models/multerSetting')

router.get('/', devicesController.reportDevice)
router.get('/create', devicesController.createDevice)
router.post('/create', uploadFile.array('deviceUrlFile', 2), devicesController.createDeviceDB)
router.post('/update', devicesController.updateDeviceDB)
router.post('/delete', devicesController.deleteDeviceDB)

module.exports = router;