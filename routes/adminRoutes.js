
//********** ADMIN ROUTES **********/

const router                    = require('express').Router()

const adminController           = require('../controller/adminController')
const token                     = require('../libs/token')
const CONSTANTS                 = require('../properties/constants')

module.exports                  = router

//ADMIN LOGIN
router.post('/login', adminController.registerAdmins, adminController.login, token.createToken('admins'))

//ADMIN ASSIGNS BOOKINGS TO DRIVER
router.put('/assign-booking', adminController.assignBooking)

//ADMIN GETS ALL BOOKINGS FROM DB
router.get('/get-all-bookings', adminController.getAllBookings)