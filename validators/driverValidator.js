
/******* DRIVER INPUT VALIDATOR *******/

const joi                       = require('joi')
const CONSTANTS                 = require('../properties/constants')

const validatedObject = (result) => {
    return {
        data: {
            message: result,
        },
        statusCode: CONSTANTS.responseFlags.VALIDATION_SUCCESS,
        message: "Validated!"
    }
}

const invalidObject = (err) => {
    return {
        data: {
            error: err.details[0].message,
        },
        statusCode: CONSTANTS.responseFlags.INVALID_INPUT,
        message: "Validation error!"
    }
}

/* 
* @function <b>validateRegister </b> <br>
* validate inputs
* @param {String} username
* @param {String} email
* @param {String} password
* @return {json object} response
*/
module.exports.validateRegister = (driver) => {
    let schema = joi.object().keys({
        username: joi.string().alphanum().min(3).max(30).required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: joi.string().email({ minDomainAtoms: 2}).required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(driver, schema, (err, result) => {
            (err) ? reject(invalidObject(err)) : resolve(validatedObject(result))
        })
    })
}

/* 
* @function <b>validateLogin </b> <br>
* validate login
* @param {String} email
* @param {String} password
* @return {json object} response
*/
module.exports.validateLogin = (driver) => {
    let schema = joi.object().keys({
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: joi.string().email({ minDomainAtoms: 2}).required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(driver, schema, (err, result) => {
            (err) ? reject(invalidObject(err)) : resolve(validatedObject(result))
        })
    })
}

/* 
* @function <b>validateCompleteBooking </b> <br>
* validate completed Bookings inputs
* @param {String} email
* @param {Number} booking_id
* @return {json object} response
*/
module.exports.validateCompleteBooking = (req, res) => {
    let schema = joi.object().keys({
        email: joi.string().email({ minDomainAtoms: 2}).required(),
        booking_id: joi.number().integer().required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(req.body, schema, (err, result) => {
            (err) ? reject(err) : resolve(result)
        })
    })
}

/* 
* @function <b>validateViewBookings </b> <br>
* validate inputs
* @param {String} email
* @param {Number} completed
* @return {json object} response
*/
module.exports.validateViewBookings = (data) => {
    let schema = joi.object().keys({
        email: joi.string().email({ minDomainAtoms: 2}).required(),
        completed: joi.number().integer().required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(data, schema, (err, result) => {
            (err) ? reject(err) : resolve(result)
        })
    })
}