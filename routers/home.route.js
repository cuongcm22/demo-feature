const express = require('express')
const router = express.Router()

const homeController = require("../controllers/homeController")

router.get('/', homeController.homePage)
router.get('/404', homeController.errorPage)

module.exports = router;