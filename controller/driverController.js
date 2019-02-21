//********** DRIVER CONTROLLER **********/

const Promise                       = require('bluebird')
const dateTime                      = require('node-datetime')

const driverValidator               = require('../validators/driverValidator')
const driverHandler                 = require('../services/driverHandler')
const bcrypt                        = require('../libs/bcrypt')
const CONSTANTS                     = require('../properties/constants')

/* 
* @function <b>registerDriver </b> <br>
* Register Driver to DB
* @param {String} username
* @param {String} email
* @param {String} password
* @return {json object} response
*/
module.exports.registerDriver = (req, res, next) => {
    let data = {
        username: req.body.username,
        email: req.body.email,
        hash: bcrypt.hashPass,
    }

    Promise.coroutine(function*() {
        yield driverValidator.validateRegister(req, res)

        yield driverHandler.addNewCredentials(data)

        res.status(CONSTANTS.responseFlags.ADDON_INSERTED).json({
            data: {
                username: data.username,
                email: data.email
            },
            statusCode: CONSTANTS.responseFlags.ADDON_INSERTED,
            message: "Driver Credentials added!"
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
* @function <b>loginDriver </b> <br>
* Login Driver
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
        yield driverValidator.validateLogin(req, res)

        yield driverHandler.checkIfDriverExists(data, res)
        next()
    })()
    .catch(err => {
        res.status(CONSTANTS.responseFlags.ADDON_DEACTIVATED).send({
            data: {
                error: err.details,
            },
            statusCode: CONSTANTS.responseFlags.ADDON_DEACTIVATED,
            message: "Error while inserting credentials!"
        })
    })
}

/* 
* @function <b>completeBooking </b> <br>
* Driver marks assigned booking complete
* @param {String} email
* @param {Number} booking_id
* @return {json object} response
*/
module.exports.completeBooking = (req, res, next) => {
    let dt = dateTime.create()
    let currentTime = dt.format('Y-m-d H:M:S').toString()

    let data = {
        email: req.body.email,
        booking_id: req.body.booking_id,
        completion_time: currentTime
    }

    Promise.coroutine(function* () {
        yield driverValidator.validateCompleteBooking(req, res)

        let driver_id = yield driverHandler.getDriverId(data.email)

        yield driverHandler.completeBooking(driver_id, data.booking_id, data.completion_time)

        res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json({
            data: {
                booking_id: data.booking_id,
                driver_id : driver_id,
                email: data.email
            },
            statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
            message: "Booking completed!"
        })
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).send({
        data: {
            error: err.details,
        },
        statusCode: CONSTANTS.responseFlags.ACTION_NOT_ALLOWED,
        message: "Invalid input!"
    }))  
}

/* 
* @function <b>viewBookings </b> <br>
* Driver views bookings
* @param {String} email
* @param {Boolean} completed
* 0 ==> to view completed bookings
* 1 ==> to view incomplete bookkings
* @return {json object} response
*/
module.exports.viewBookings = (req, res, next) => {
    let data = {
        driver_email: req.body.email,
        completed: req.body.completed
    }

    Promise.coroutine(function*() {
        yield driverValidator.validateViewBookings(req, res)

        let driver_id = yield driverHandler.getDriverId(data.driver_email)
        
        let result = yield driverHandler.getDriverBookings(driver_id, data.completed)

        res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json({
            data: {
                result
            },
            statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
            message: "Get all Bookings driver!"
        })
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).send({
        data: {
            error: err.details,
        },
        statusCode: CONSTANTS.responseFlags.ACTION_NOT_ALLOWED,
        message: "Invalid input!"
    }))  
}