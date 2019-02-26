
//********** DRIVER HANDLER **********/

const Promise                       = require('bluebird')

const connection                    = require('../database/mysql')
const bcrypt                        = require('../libs/bcrypt')
const CONSTANTS                     = require('../properties/constants')
const db                            = require('../database/mongodb')
const driverUtilities               = require('../utilities/driverUtilities')
const bookingUtilities               = require('../utilities/bookingUtilities')

/* 
* @function <b>updateLogs </b> <br>
* updatelogs in mongo db
*/
const updateLogs = (driver_id, booking_id, completion_time) => {
    return db.getDB().collection('logs').updateOne(
        {booking_id: booking_id},
        { $push: { completion_time: completion_time } }
    )
}

/* 
* @function <b>selectPassword </b> <br>
* Get password from DB 
* @param {Object} adminObj
* @return {resolved Promise} password
*/
const selectPassword = (driverObj) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT hash from drivers WHERE email = ?`, driverObj.email, 
        (err, result) => {
            (err) ? reject(err) : 
            resolve(checkPassword(driverObj, result[0].hash))
        })
    })
}

/* 
* @function <b>checkPassword </b> <br>
* Check if passwor is correct
* @param {Object} adminObj
* @param {String} password
* @return {resolved Promise} adminObj
*/
let checkPassword = (userObj, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.matchPassword(userObj.password, hash)
        .then(() => resolve(driverUtilities.loginSuccessfull(userObj)))
        .catch(() => reject(driverUtilities.incorrectPassword()))
    })
}

/* 
* @function <b>getAdminId </b> <br>
* Get Admin Id
* @param {String} email
* @return {resolved Promise} response
*/
module.exports.getDriverId = (email) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT driver_id FROM drivers WHERE email = ? `, email, (err, result) => {
            (err) ? reject(err) : resolve(result[0].driver_id)
        })
    })
}

/* 
* @function <b>getAdminId </b> <br>
* Get Admin Id
* @param {String} email
* @return {resolved Promise} response
*/
module.exports.getBookingId = (driver_id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT booking_id FROM bookings WHERE driver_id = ? `, driver_id, (err, result) => {
            (err || result.length === 0) ? 
            reject(bookingUtilities.noBookingsFound()) : 
            resolve(result[0].booking_id)
        })
    })
}

/* 
* @function <b>addNewCredentials </b> <br>
* Add new credentials to DB
* @param {Object} obj
* @return {resolved Promise} response
*/
module.exports.addNewCredentials = (obj) => {

    delete obj.password
    obj.hash = bcrypt.hashPass
    
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO drivers SET ?`, obj, 
        (err, result) => {
            (err) ? 
            reject(driverUtilities.driverAlreadyExists(err, result)) : 
            resolve(driverUtilities.newDriverAdded(obj))
        })
    })
}

/* 
* @function <b>checkIfAdminExists </b> <br>
* check if admin already exists in DB
* @param {Object} admin 
* @return {resolved Promise} response
*/
module.exports.checkIfDriverExists = (user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM drivers WHERE email = '${user.email}'`, 
        (err, result) => {
            ((err) || (result.length === 0)) ? 
            reject(driverUtilities.driverNotRegistered(user.username)) : 
            resolve(selectPassword(user)) 
        })
    })
}

/* 
* @function <b>checkIfAdminExists </b> <br>
* check if admin already exists in DB
* @param {Object} admin 
* @return {resolved Promise} response
*/
module.exports.checkIfDriverAlredyExists = (user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM drivers WHERE email = '${user.email}'`, 
        (err, result) => {
            ((err) || (result.length !== 0)) ? 
            reject(driverUtilities.driverAlreadyExists(err, result)) : 
            resolve(driverUtilities.newDriverAdded(result))
        })
    })
}

/* 
* @function <b>checkIfBookingExists </b> <br>
* check if admin already exists in DB
* @param {Object} admin 
* @return {resolved Promise} response
*/
module.exports.checkIfBookingExists = (booking_id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM bookings WHERE booking-id = '${booking_id}'`, 
        (err, result) => {
            ((err) || (result.length !== 0)) ? 
            reject(bookingUtilities.noBookingsFound()) : 
            resolve()
        })
    })
}

/* 
* @function <b>completeBooking </b> <br>
* MARK BOOKING COMPLETE IN db
* @param {Number} driver_id
* @param {Number} booking_id
* @return {resolved Promise} response
*/
module.exports.completeBooking = (driver_id, booking_id, completion_time) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE bookings SET completed = 1 WHERE booking_id = '${booking_id}';
                          UPDATE drivers SET assigned = 0 WHERE driver_id = '${driver_id}'`, 
        (err, result) => {
            (err) ? reject(err) : 
            (updateLogs(driver_id, booking_id, completion_time),
            resolve(driverUtilities.bookingCompleted(driver_id, booking_id)))
        })
    })
}

/* 
* @function <b>getDriverBookings </b> <br>
* get all driver bookings
* @param {Number} completed
* @return {resolved Promise} response
*/
module.exports.getDriverBookings = (booking_id, completed) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT bookings.from_location, bookings.to_location, bookings.booking_time, bookings.completed, drivers.username 
                          FROM bookings 
                          INNER JOIN drivers ON drivers.driver_id = bookings.driver_id 
                          WHERE completed = '${completed}' AND booking_id = '${booking_id}'`, 
            (err, result) => {
            (err || result.length === 0) ? 
            reject(bookingUtilities.noBookingsFound()) : 
            resolve(driverUtilities.allBookings(result))
        })
    })
}