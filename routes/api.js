const express = require('express')
const passport = require('passport')
const jsonParser = require('body-parser').json()
const router = express.Router()
const apiController = require('../controllers/api')
const customMiddleware = require('../utils/customMiddleware')

router.post('/register', jsonParser, apiController.register)
router.post('/login', jsonParser, apiController.login)
router.get('/protected', passport.authenticate('jwt', { session: false }), apiController.protected)
router.post('/room', jsonParser, passport.authenticate('jwt', { session: false }), customMiddleware.validateSuperadmin , apiController.room)
router.get('/room', apiController.getRoom)
router.post('/chooseRoom', jsonParser, passport.authenticate('jwt', { session: false }), apiController.chooseRoom)
router.put('/chooseHand', jsonParser, passport.authenticate('jwt', { session: false }), apiController.chooseHand)

module.exports = router



