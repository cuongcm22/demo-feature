const express = require('express')
const router = express.Router()

const authenToken = require("../modules/authServer")
const devicesController = require("../controllers/devicesController")

router.get('/create', devicesController.createDevice)
router.post('/add', devicesController.createDeviceDB)
router.post('/update', devicesController.updateDeviceDB)
router.post('/delete', devicesController.deleteDeviceDB)
router.get('/report', devicesController.reportDevice)
router.get('/loan', authenToken.authenToken, devicesController.loanDevice)
router.post('/loan', authenToken.authenToken, devicesController.loanDeviceDB)
router.get('/return', authenToken.authenToken, devicesController.returnDevice)
router.post('/return', authenToken.authenToken, devicesController.returnDeviceDB)
router.get('/loanrecord', devicesController.loanRecord)

module.exports = router;