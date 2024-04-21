const express = require('express');
const router = express.Router();
const authenToken = require("../modules/authServer");
const devicesController = require("../controllers/devicesController");

// Define routes with HTTP methods and corresponding controller functions
router.get('/create', devicesController.showCreateDevicePage);
router.post('/add', devicesController.createDeviceDB);
router.post('/update', devicesController.updateDeviceDB);
router.post('/delete', devicesController.deleteDeviceDB);
router.get('/report', devicesController.ShowReportDevicePage);

// Routes requiring authentication
router.get('/loan', devicesController.ShowLoanDevicePage);
router.post('/loan', authenToken.authenToken, devicesController.loanDeviceDB);
// router.get('/return', authenToken.authenToken, devicesController.showReturnDevicePage);
// router.post('/return', authenToken.authenToken, devicesController.returnDeviceDB);

// Non-authenticated route
// router.get('/loanrecord', devicesController.loanRecord);

module.exports = router;
