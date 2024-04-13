const express = require('express');
const router = express.Router();
const locationsController = require("../controllers/locationsController");

// Show page create Locations
router.get('/create', locationsController.showCreateLocationsPage);
router.post('/add', locationsController.addLocations);

// Show detail Locations page
router.get('/detail', locationsController.showDetailLocationsPage);
// Route update Locations
router.post('/update', locationsController.updateLocations);
// Delete supplier
router.post('/delete', locationsController.deleteLocations);
module.exports = router;