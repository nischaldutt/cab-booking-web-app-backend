//********** DRIVER ROUTES **********/

const router                    = require('express').Router()

const driverController          = require('../controller/driverController')
const bcrypt                    = require('../libs/bcrypt')
const token                     = require('../libs/token')

module.exports                  = router

//REGISTER DRIVER
router.post('/register', bcrypt.hashPassword, driverController.registerDriver)

//LOGIN DRIVER
router.post('/login', driverController.login, token.createToken('drivers'))

//DRIVER COMPLETED BOOKING
router.put('/complete-booking', token.accessToken('drivers'), driverController.completeBooking)

//DRIVER VIEWS BOOKINGS
router.get('/view-bookings', token.accessToken('drivers'), driverController.viewBookings)