const express = require('express');
const router = express.Router();
const deviceTypesController = require("../controllers/deviceTypesController");

// Show page create DeviceTypes
router.get('/create', deviceTypesController.showCreateDeviceTypesPage);
router.post('/add', deviceTypesController.addDeviceTypes);

// Show detail DeviceTypes page
router.get('/detail', deviceTypesController.showDetailDeviceTypesPage);
// Route update DeviceTypes
router.post('/update', deviceTypesController.updateDeviceTypes);
// Delete supplier
router.post('/delete', deviceTypesController.deleteDeviceTypes);
module.exports = router;