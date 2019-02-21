//********** ADMIN ROUTES **********/

const router                    = require('express').Router()

const adminController           = require('../controller/adminController')
const token                     = require('../libs/token')
const CONSTANTS                     = require('../properties/constants')

module.exports                  = router

//ADMIN LOGIN
router.post('/login', adminController.login, token.createToken('admins'))

//ADMIN ASSIGNS BOOKINGS TO DRIVER
router.put('/assign-booking', token.accessToken('admins'), adminController.assignBooking)

//ADMIN GETS ALL BOOKINGS FROM DB
router.get('/get-all-bookings', token.accessToken('admins'), adminController.getAllBookings)