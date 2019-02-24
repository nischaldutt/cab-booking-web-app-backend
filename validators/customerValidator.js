
/******* CUSTOMER INPUT VALIDATOR *******/

const joi                       = require('joi')
const CONSTANTS                 = require('../properties/constants')

/* 
* @function <b>validatedObject </b> <br>
* post validated object
* @return {json object} response
*/
const validatedObject = (result) => {
    return {
        data: {
            message: result,
        },
        statusCode: CONSTANTS.responseFlags.VALIDATION_SUCCESS,
        message: "Validated!"
    }
}

/* 
* @function <b>invalidObject </b> <br>
* post invalid object
* @return {json object} response
*/
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
module.exports.validateRegister = (customer) => {
    let schema = joi.object().keys({
        username: joi.string().alphanum().min(3).max(30).required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: joi.string().email({ minDomainAtoms: 2}).required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(customer, schema, (err, result) => {
            (err) ? reject(invalidObject(err)) : resolve(validatedObject(result))
        })
    })
}

/* 
* @function <b>validateLogin </b> <br>
* validate inputs
* @param {String} email
* @param {String} password
* @return {json object} response
*/
module.exports.validateLogin = (customer) => {
    let schema = joi.object().keys({
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: joi.string().email({ minDomainAtoms: 2}).required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(customer, schema, (err, result) => {
            (err) ? reject(invalidObject(err)) : resolve(validatedObject(result))
        })
    })
}

/* 
* @function <b>createBooking </b> <br>
* validate inputs
* @return {json object} response
*/
module.exports.createBooking = (data) => {
    let schema = joi.object().keys({
        email: joi.string().email({ minDomainAtoms: 2}).required(),
        from_latitude: joi.number().precision(2).required(),
        from_longitude: joi.number().precision(2).required(),
        to_latitude: joi.number().precision(2).required(),
        to_longitude: joi.number().precision(2).required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(data, schema, (err, result) => {
            (err) ? reject(invalidObject(err)) : resolve(validatedObject(result))
        })
    })
}