const express = require('express')
const router = express.Router()

const devicesController = require("../controllers/devicesController")

router.get('/', devicesController.reportDevice)
router.get('/create', devicesController.createDevice)
router.post('/create', devicesController.createDeviceDB)
router.post('/update', devicesController.updateDeviceDB)
router.post('/delete', devicesController.deleteDeviceDB)

module.exports = router;