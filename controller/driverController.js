
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
        password: req.body.password,
    }

    Promise.coroutine(function*() {
        yield driverValidator.validateRegister(data)
        yield driverHandler.checkIfDriverAlredyExists(data)
        let newDriver = yield driverHandler.addNewCredentials(data)
        res.status(CONSTANTS.responseFlags.ADDON_INSERTED).json(newDriver)
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).json(err))   
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
        yield driverValidator.validateLogin(data)
        yield driverHandler.checkIfDriverExists(data)
        next()
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).json(err))
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

        yield driverHandler.checkIfBookingExists(data.booking_id)

        let driver_id = yield driverHandler.getDriverId(data.email)

        let completed = yield driverHandler.completeBooking(driver_id, data.booking_id, data.completion_time)

        res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json(completed)
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).send(err)) 
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
        driver_email: req.query.email,
        completed: req.query.completed
    }
    Promise.coroutine(function*() {
        let driver_id = yield driverHandler.getDriverId(data.driver_email)
        
        let booking_id = yield driverHandler.getBookingId(driver_id)

        let result = yield driverHandler.getDriverBookings(booking_id, data.completed)

        res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json(result)
    })()
    .catch(err => res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).json(err))  
}