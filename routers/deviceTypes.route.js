const express = require('express');
const router = express.Router();
const deviceTypesController = require("../controllers/deviceTypesController");

// Show page create Locations
router.get('/create', deviceTypesController.showCreateLocationsPage);
router.post('/add', deviceTypesController.addLocations);

// Show detail Locations page
router.get('/detail', deviceTypesController.showDetailLocationsPage);
// Route update Locations
router.post('/update', deviceTypesController.updateLocations);
// Delete supplier
router.post('/delete', deviceTypesController.deleteLocations);
module.exports = router;