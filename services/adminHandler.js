
//********** ADMIN HANDLER **********/


const Promise                       = require('bluebird')
const dateTime                      = require('node-datetime')

const connection                    = require('../database/mysql')
const db                            = require('../database/mongodb')
const CONSTANTS                     = require('../properties/constants')
const bookingUtilities              = require('../utilities/bookingUtilities')

const loginSuccessfull = (admin) => {
    return {
        data: {
            email: admin.email,
        },
        statusCode: CONSTANTS.responseFlags.LOGIN_SUCCESSFULLY,
        message: 'Login Successfull!'
    }
}

const incorrectPassword = () => {
    return {
        data: {
            message: `Password incorrect!`
        },
        statusCode: CONSTANTS.responseFlags.WRONG_PASSWORD,
        message: 'Please enter correct password!'
    }
}

/* 
* @function <b>selectPassword </b> <br>
* Get password from DB 
* @param {Object} adminObj
* @return {resolved Promise} password
*/
const selectPassword = (adminObj) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT password from admins WHERE email = ?`, adminObj.email, 
        (err, result) => {
            (err) ? reject(err) : resolve(checkPassword(adminObj, result[0].password))
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
const checkPassword = (adminObj, password) => {
    return new Promise((resolve, reject) => {
        (adminObj.password === password) ? 
        resolve(loginSuccessfull(adminObj)) : 
        reject(incorrectPassword())
    })
}

/* 
* @function <b>pushLogs </b> <br>
* Push logs to mongoDB
* @param {Number} admin_id
* @param {Number} driver_id
* @param {Number} booking_id
* @param {DateTime} current_time
*/
const pushLogs = (admin_id, driver_id, booking_id, currentTime) => {
    try {
        db.getDB().collection('logs').insertOne({
            admin_id: admin_id,
            driver_id: driver_id,
            booking_id: booking_id,
            booking_time: currentTime,
        })
    } catch (e) {
        throw(e)
    }
}

module.exports.alreadyRegistered = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM admins`, (err, result) => {
            (result.length === 0) ? 
            resolve(false) : resolve(true)
        })
    })
}

/* 
* @function <b>getAdminId </b> <br>
* Get Admin Id
* @param {String} email
* @return {resolved Promise} response
*/
module.exports.getAdminId = (email, res) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT admin_id FROM admins WHERE email = ? `, email, (err, result) => {
            (err) ? 
            reject() : 
            resolve(result[0].admin_id)
        })
    })
}

/* 
* @function <b>addNewCredentials </b> <br>
* Add new credentials to DB
* @param {Object} obj
* @return {resolved Promise} response
*/
module.exports.addNewCredentials = (admins) => {
    let sql = `INSERT INTO admins (username, email, password) VALUES ?`
    let values = [
        [`${admins[0].username}`, `${admins[0].email}`, `${admins[0].password}`],
        [`${admins[1].username}`, `${admins[1].email}`, `${admins[1].password}`]
    ]
    return new Promise((resolve, reject) => {
        connection.query(sql, [values], (err, result) => {
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
module.exports.checkIfAdminExists = (admin) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM admins WHERE email = '${admin.email}'`, 
        (err, result) => {
          ((result.length === 0 ) || (err)) ? 
          reject(err) : 
          resolve(selectPassword(admin))
        })
    })
}

/* 
* @function <b>getAllBookings </b> <br>
* get all bookings in DB
* @return {resolved Promise} response
*/
module.exports.getAllBookings = () => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT bookings.from_location, bookings.to_location, bookings.booking_time, bookings.completed, customers.username, customers.email, drivers.username, drivers.email, drivers.assigned
                          FROM ((bookings 
                          LEFT OUTER JOIN customers ON bookings.customer_id = customers.customer_id)
                          LEFT OUTER JOIN drivers ON bookings.driver_id = drivers.driver_id)`, (err, result) => {
            (err) ? reject(err) : resolve(result)
        })
    })
}

/* 
* @function <b>checkIfDriverAssigned </b> <br>
* check if driver is alredy assigned a booking
* @param {Number} driver_id 
* @return {resolved Promise} response
*/
module.exports.checkIfDriverAssigned =(driver_id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT assigned FROM drivers WHERE driver_id = '${driver_id}'`, (err, result) => {
            ((err) ? 
            reject(err) : 
            (result[0].assigned === 1) ? 
            reject(bookingUtilities.driverAlreadyAssigned(driver_id)): resolve())
        })
    })
}

/* 
* @function <b>assignBooking </b> <br>
* handler to assign Booking
* @param {Number} admin_id 
* @param {Number} driver_id 
* @param {Number} booking_id 
* @return {callback}
*/
module.exports.assignBooking = (admin_id, driver_id, booking_id) => {
    let dt = dateTime.create()
    let currentTime = dt.format('Y-m-d H:M:S').toString()
    return new Promise((reject, resolve) => {
        connection.query(`UPDATE bookings SET admin_id = '${admin_id}', driver_id = '${driver_id}' WHERE booking_id = '${booking_id}';
                          UPDATE drivers SET assigned = 1 WHERE driver_id = '${driver_id}'`, 
            (err, result) => {
            (err) ? 
            reject(bookingUtilities.noBooking(admin_id, driver_id, booking_id)) : 
            (pushLogs(admin_id, driver_id, booking_id, currentTime),
            resolve(bookingUtilities.bookingAssigned(admin_id, driver_id, booking_id)))
        })
    })
}