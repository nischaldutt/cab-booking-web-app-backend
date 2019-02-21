//********** CUSTOMER HANDLER **********/

const Promise                       = require('bluebird')

const connection                    = require('../database/mysql')
const CONSTANTS                     = require('../properties/constants')
const bcrypt                        = require('../libs/bcrypt')

/* 
* @function <b>selectPassword </b> <br>
* Get password from DB 
* @param {Object} adminObj
* @return {resolved Promise} password
*/
let selectPassword = (userObj) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT hash from customers WHERE email = ?`, userObj.email, (err, result) => {
            (err) ? reject(err) : resolve(checkPassword(userObj, result[0].hash))
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
            .then(result => resolve(result))
            .catch(err => reject(err))
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
        connection.query(`INSERT INTO customers SET ?`, obj, (err, result) => {
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
module.exports.checkIfCustomerExists = (user, res) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM customers WHERE email = '${user.email}'`, (err, result) => {
          ((result.length === 0 ) || (err)) ? 
            res.status(CONSTANTS.responseFlags.USER_NOT_FOUND).send({
                data: {
                    error: 'user not registered',
                },
                statusCode: CONSTANTS.responseFlags.USER_NOT_FOUND,
                message: "User not registered!"
            })
         : resolve(selectPassword(user))
        })
    })
}

/* 
* @function <b>getCustomerCredentials </b> <br>
* get customer credentials
* @param {String} email
* @return {resolved Promise} response
*/
module.exports.getCustomerCredentials = (email, res) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from customers where email = ? `, email, (err, result) => {
            (err) ? res.status(CONSTANTS.responseFlags.USER_NOT_FOUND).send({
                data: {
                    error: 'user not registered',
                },
                statusCode: CONSTANTS.responseFlags.USER_NOT_FOUND,
                message: "User not registered!"
            }) : resolve(result[0])
        })
    })
}

/* 
* @function <b>insertBookingData </b> <br>
* insert booking data to DB
* @param {Object} data
* @return {callback} data
*/
module.exports.insertBookingData = (data, callback) => {
    connection .query(`INSERT INTO bookings (from_location, to_location, customer_id) VALUES (GeomFromText('POINT(${data.from_latitude} ${data.from_longitude})'), GeomFromText('POINT(${data.to_latitude} ${data.to_longitude})'), '${data.customer_id}')`, (err, result) => {
        (err) ? callback(err, null) : callback(null, result)
    })
}

/* 
* @function <b>getCustomerBookings </b> <br>
* get customer booking
* @param {Number} customer_id
*/
module.exports.getCustomerBookings = (customer_id, res) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT from_location, to_location, booking_time FROM bookings WHERE customer_id = '${customer_id}'`, (err, result) => {
            ((result.length === 0 ) || (err)) ? 
                res.status(CONSTANTS.responseFlags.USER_NOT_FOUND).send({
                    data: {
                        error: 'no bookings created by customer!',
                    },
                    statusCode: CONSTANTS.responseFlags.USER_NOT_FOUND,
                    message: "Pleases make some bookings!"
                })
            : resolve(result)
        })
    })
}