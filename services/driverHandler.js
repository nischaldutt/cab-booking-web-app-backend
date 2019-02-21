//********** DRIVER HANDLER **********/

const Promise                       = require('bluebird')

const connection                    = require('../database/mysql')
const bcrypt                        = require('../libs/bcrypt')
const CONSTANTS                     = require('../properties/constants')
const db                            = require('../database/mongodb')

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
        connection.query(`SELECT hash from drivers WHERE email = ?`, driverObj.email, (err, result) => {
            (err) ? reject(err) : resolve(checkPassword(driverObj, result[0].hash))
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
const checkPassword = (driverObj, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.matchPassword(driverObj.password, hash)
            .then(result => resolve(result))
            .catch(err => reject(err))
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
* @function <b>addNewCredentials </b> <br>
* Add new credentials to DB
* @param {Object} obj
* @return {resolved Promise} response
*/
module.exports.addNewCredentials = (obj) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO drivers SET ?`, obj, (err, result) => {
            (err) ? reject(err) : resolve(result)
        })
    })
}

/* 
* @function <b>checkIfAdminExists </b> <br>
* check if admin already exists in DB
* @param {Object} admin 
* @return {resolved Promise} response
*/
module.exports.checkIfDriverExists = (driver, res) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM drivers WHERE email = '${driver.email}'`, (err, result) => {
          ((result.length === 0 ) || (err)) ? 
            res.status(CONSTANTS.responseFlags.USER_NOT_FOUND).send({
                data: {
                    error: 'user not registered',
                },
                statusCode: CONSTANTS.responseFlags.USER_NOT_FOUND,
                message: "User not registered!"
            }) : 
        resolve(selectPassword(driver))
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
            updateLogs(driver_id, booking_id, completion_time)
            resolve(result)
        })
    })
}

/* 
* @function <b>getDriverBookings </b> <br>
* get all driver bookings
* @param {Number} completed
* @return {resolved Promise} response
*/
module.exports.getDriverBookings = (driver_id, completed) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT bookings.from_location, bookings.to_location, bookings.booking_time, bookings.completed, drivers.username 
                          FROM bookings 
                          INNER JOIN drivers ON drivers.driver_id = bookings.driver_id 
                          WHERE completed = '${completed}'`, 
            (err, result) => {
                (err) ? reject(err) : resolve(result)
        })
    })
}