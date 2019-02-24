
//********** DRIVER ROUTES **********/

const router                    = require('express').Router()

const driverController          = require('../controller/driverController')
const bcrypt                    = require('../libs/bcrypt')
const token                     = require('../libs/token')
const CONSTANTS                 = require('../properties/constants')

module.exports                  = router

//REGISTER DRIVER
router.post('/register', bcrypt.hashPassword, driverController.registerDriver)

//LOGIN DRIVER
router.post('/login', driverController.login, token.createToken('drivers'))

//DRIVER COMPLETED BOOKING
router.put('/complete-booking', driverController.completeBooking)

//DRIVER VIEWS BOOKINGS
router.get('/view-bookings', driverController.viewBookings)