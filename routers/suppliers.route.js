const express = require('express');
const router = express.Router();
const suppliersController = require("../controllers/suppliersController");

// Show page create suppliers
router.get('/create', suppliersController.showCreateSuppliersPage);
router.post('/add', suppliersController.addSuppliers);

// Show detail suppliers page
router.get('/detail', suppliersController.showDetailSuppliersPage);
// Retrieve all suppliers 
router.get('/retrieve', suppliersController.retrieveAllSuppliersTable);
// Route update suppliers
router.post('/update', suppliersController.updateSuppliers);
// Delete supplier
router.post('/delete', suppliersController.deleteSuppliers);
module.exports = router;