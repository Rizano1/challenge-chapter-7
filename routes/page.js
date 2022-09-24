const express = require('express')
const passport = require('passport')
const router = express.Router()
const pageController = require('../controllers/page')
const customMiddleware = require('../utils/customMiddleware')

router.get('/login', pageController.login)
router.get('/adminDashboard', pageController.adminDashboard)


module.exports = router



