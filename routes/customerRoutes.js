
//********** CUSTOMER ROUTES **********/

const router                    = require('express').Router()

const customerController        = require('../controller/customerController')
const bcrypt                    = require('../libs/bcrypt')
const token                     = require('../libs/token')
const CONSTANTS                 = require('../properties/constants')

module.exports                  = router

//REGISTER CUSTOMER
router.post('/register', bcrypt.hashPassword, customerController.registerCustomer)

//LOGIN CUSTOMER
router.post('/login', customerController.login, token.createToken('customers'))

//CUSTOMER CREATES BOOKING
router.post('/create-booking', customerController.createBooking)

//CUSTOMER VIEWS BOOKINGS
router.get('/view-bookings', customerController.viewBookings)