const express = require('express')
const router = express.Router()

const usersController = require("../controllers/usersController")

router.get('/login', usersController.userLogin)
router.post('/login', usersController.userLoginDB)
router.get('/register', usersController.userRegister)
router.post('/register', usersController.userRegisterDB)

module.exports = router;