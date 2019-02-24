
//********** CUSTOMER HANDLER **********/

const Promise                       = require('bluebird')

const connection                    = require('../database/mysql')
const CONSTANTS                     = require('../properties/constants')
const bcrypt                        = require('../libs/bcrypt')
const customerUtilities            = require('../utilities/customerUtilities')

/* 
* @function <b>selectPassword </b> <br>
* Get password from DB 
* @param {Object} adminObj
* @return {resolved Promise} password
*/
const selectHash = (userObj) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT hash from customers WHERE email = ?`, userObj.email, 
        (err, result) => {
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
const checkPassword = (userObj, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.matchPassword(userObj.password, hash)
        .then(() => resolve(customerUtilities.loginSuccessfull(userObj)))
        .catch(() => reject(customerUtilities.incorrectPassword()))
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
        connection.query(`INSERT INTO customers SET ?`, obj, 
        (err, result) => {
            (err) ? 
            reject(customerUtilities.customerAlreadyExists(err, result)) : 
            resolve(customerUtilities.newCustomerAdded(obj))
        })
    })
}

/* 
* @function <b>checkIfAdminExists </b> <br>
* check if admin exists in DB
* @param {Object} admin 
* @return {resolved Promise} response
*/
module.exports.checkIfCustomerExists = (user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM customers WHERE email = '${user.email}'`, 
        (err, result) => {
            ((err) || (result.length === 0)) ? 
            reject(customerUtilities.customerNotRegistered(user.username)) : 
            resolve(selectHash(user)) 
        })
    })
}

/* 
* @function <b>checkIfAdminAlreadyExists </b> <br>
* check if admin already exists in DB
* @param {Object} admin 
* @return {resolved Promise} response
*/
module.exports.checkIfCustomerAlredyExists = (user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM customers WHERE email = '${user.email}'`, 
        (err, result) => {
            ((err) || (result.length !== 0)) ? 
            reject(customerUtilities.customerAlreadyExists(err, result)) : 
            resolve(customerUtilities.newCustomerAdded(result))
        })
    })
}

/* 
* @function <b>getCustomerCredentials </b> <br>
* get customer credentials
* @param {String} email
* @return {resolved Promise} response
*/
module.exports.getCustomerId = (email) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from customers where email = ? `, email, 
        (err, result) => {
            (err) ? 
            reject(customerUtilities.customerNotRegistered(email)) : 
            resolve(result[0].customer_id)
        })
    })
}

/* 
* @function <b>getCustomerCredentials </b> <br>
* get customer credentials
* @param {String} email
* @return {resolved Promise} response
*/
module.exports.getCustomerCredentials = (email) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from customers where email = ? `, email, 
        (err, result) => {
            (err) ? 
            reject(customerUtilities.customerNotRegistered(email)) : 
            resolve(result[0])
        })
    })
}

/* 
* @function <b>insertBookingData </b> <br>
* insert booking data to DB
* @param {Object} data
* @return {callback} data
*/
module.exports.insertBookingData = (data) => {
    return new Promise((resolve, reject) => {
        connection .query(`INSERT INTO bookings (from_location, to_location, customer_id) 
                            VALUES (GeomFromText('POINT(${data.from_latitude} ${data.from_longitude})'), 
                            GeomFromText('POINT(${data.to_latitude} ${data.to_longitude})'), 
                            '${data.customer_id}')`, 
        (err, result) => {
            (err) ? 
            reject(err) : 
            resolve(customerUtilities.bookingCreated(data))
        })
    })
}

/* 
* @function <b>getCustomerBookings </b> <br>
* get customer booking
* @param {Number} customer_id
*/
module.exports.getCustomerBookings = (customer_id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT from_location, to_location, booking_time FROM bookings WHERE customer_id = '${customer_id}'`, 
        (err, result) => {
            ((result.length === 0 ) || (err)) ? 
            reject(customerUtilities.noBookingsavailable()) :
            resolve(customerUtilities.allBookings(result))
        })
    })
}