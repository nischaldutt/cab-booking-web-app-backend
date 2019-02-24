
//********** CUSTOMER CONTROLLER **********/

const Promise                       = require('bluebird')

const customerValidator             = require('../validators/customerValidator')
const customerHandler               = require('../services/customerHandler')
const token                         = require('../libs/token')
const bcrypt                        = require('../libs/bcrypt')
const CONSTANTS                     = require('../properties/constants')

/* 
* @function <b>registerCustomer </b> <br>
* Register Customer to DB
* @param {String} username
* @param {String} email
* @param {String} password
* @return {json object} response
*/
module.exports.registerCustomer = (req, res, next) => {
    let data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }

    Promise.coroutine(function*() {
        yield customerValidator.validateRegister(data)
        yield customerHandler.checkIfCustomerAlredyExists(data)
        let newCustomer = yield customerHandler.addNewCredentials(data)
        res.status(CONSTANTS.responseFlags.ADDON_INSERTED).json(newCustomer)
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).json(err))
}

/* 
* @function <b>loginCustomer </b> <br>
* Login Customer
* @param {String} email
* @param {String} password
* @return {json object} response
*/
module.exports.login = (req, res, next) => {
    let data = {
        email: req.body.email,
        password: req.body.password,
    }

    Promise.coroutine(function*() {
        yield customerValidator.validateLogin(data)
        yield customerHandler.checkIfCustomerExists(data)
        next()
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).json(err))
}

/* 
* @function <b>createBooking </b> <br>
* Customer creates booking in DB
* @param {Point} from_latitude
* @param {Point} from_longitude
* @param {Point} to_latitude
* @param {Point} to_longitude
* @param {String} email
* @return {json object} response
*/
module.exports.createBooking = (req, res, next) => {
    let data = {
        from_latitude: req.body.from_latitude,
        from_longitude: req.body.from_longitude,
        to_latitude: req.body.to_latitude,
        to_longitude: req.body.to_longitude,
        email: req.body.email,
    }

    Promise.coroutine(function*() {
        yield customerValidator.createBooking(data)
        let customerEmail = yield token.accessToken('customers', data)
        let customer_id = yield customerHandler.getCustomerId(customerEmail)

        delete data.email
        data.customer_id = customer_id

        let booking = yield customerHandler.insertBookingData(data)
        res.status(CONSTANTS.responseFlags.ADDON_INSERTED).json(booking)
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).json(err))
}

/* 
* @function <b>viewBookings </b> <br>
* Customer views bookings
* @param {String} email
* @return {json object} response
*/
module.exports.viewBookings = (req, res, next) => {
    let data = {
        customer_email: req.query.email,   
    }
    
    Promise.coroutine(function*() {

        let customer = yield customerHandler.getCustomerCredentials(data.customer_email)
        let bookings = yield customerHandler.getCustomerBookings(customer.customer_id)

        res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json(bookings)
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).json(err)) 
}