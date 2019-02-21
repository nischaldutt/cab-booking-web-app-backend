//********** CUSTOMER CONTROLLER **********/


const Promise                       = require('bluebird')

const customerValidator             = require('../validators/customerValidator')
const customerHandler               = require('../services/customerHandler')
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
        hash: bcrypt.hashPass,
    }

    Promise.coroutine(function*() {
        yield customerValidator.validateRegister(req, res)

        yield customerHandler.addNewCredentials(data)

        res.status(CONSTANTS.responseFlags.ADDON_INSERTED).json({
            data: {
                username: data.username,
            },
            statusCode: CONSTANTS.responseFlags.ADDON_INSERTED,
            message: "Customer Credentials added!"
        })
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ADDON_DEACTIVATED).send({
        data: {
            error: err.details,
        },
        statusCode: CONSTANTS.responseFlags.ADDON_DEACTIVATED,
        message: "Error while inserting credentials!"
    }))
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
        yield customerValidator.validateLogin(req, res)

        yield customerHandler.checkIfCustomerExists(data, res)
        next()
    })()
    .catch(err => {
        res.status(CONSTANTS.responseFlags.UPLOAD_ERROR).json({
            data: {
                error: err.details
            },
            statusCode: CONSTANTS.responseFlags.UPLOAD_ERROR,
            message: "Invalid input data!"
        })
    })
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
    Promise.coroutine(function*() {
        let customer = yield customerHandler.getCustomerCredentials(res.locals.email, res)
    
        let data = {
            from_latitude: req.body.from_latitude,
            from_longitude: req.body.from_longitude,
            to_latitude: req.body.to_latitude,
            to_longitude: req.body.to_longitude,
            customer_id: customer.customer_id,
        }
        
        yield customerValidator.createBooking(req, res)

        customerHandler.insertBookingData(data, (err, result) => {
            (result) ? res.status(CONSTANTS.responseFlags.ADDON_INSERTED).json({
                data: {
                    customer_id: customer.customer_id,
                },
                statusCode: CONSTANTS.responseFlags.ADDON_INSERTED,
                message: 'Booking created!'
            }) : res.status(CONSTANTS.responseFlags.ADDON_DEACTIVATED).json({
                data: {
                    customer_id: customer.customer_id,
                },
                statusCode: CONSTANTS.responseFlags.ADDON_DEACTIVATED,
                message: 'Booking failed!'
            })
        })
    })()
    .catch(err => {
        res.status(CONSTANTS.responseFlags.UPLOAD_ERROR).json({
            data: {
                error: err.details
            },
            statusCode: CONSTANTS.responseFlags.UPLOAD_ERROR,
            message: "Invalid input data!"
        })
    })
}

/* 
* @function <b>viewBookings </b> <br>
* Customer views bookings
* @param {String} email
* @return {json object} response
*/
module.exports.viewBookings = (req, res, next) => {
    let data = {
        customer_email: req.body.email,   
    }

    Promise.coroutine(function*() {

        let customer = yield customerHandler.getCustomerCredentials(data.customer_email, res)

        let bookings = yield customerHandler.getCustomerBookings(customer.customer_id, res)

        res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json({
            data: {
                bookings: bookings
            },
            statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
            message: "Got all bookings done by customer!"
        })
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).send({
        data: {
            error: err.message,
        },
        statusCode: CONSTANTS.responseFlags.ACTION_NOT_ALLOWED,
        message: "Customer doesnot exists!"
    })) 
}