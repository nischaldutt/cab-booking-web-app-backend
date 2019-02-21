/******* CUSTOMER VALIDATOR *******/

const joi = require('joi')

/* 
* @function <b>validateRegister </b> <br>
* validate inputs
* @param {String} username
* @param {String} email
* @param {String} password
* @return {json object} response
*/
module.exports.validateRegister = (req, res) => {
    let schema = joi.object().keys({
        username: joi.string().alphanum().min(3).max(30).required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: joi.string().email({ minDomainAtoms: 2}).required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(req.body, schema, (err, result) => {
            (err) ? reject(err) : resolve(result)
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
module.exports.validateLogin = (req, res) => {
    let schema = joi.object().keys({
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: joi.string().email({ minDomainAtoms: 2}).required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(req.body, schema, (err, result) => {
            (err) ? reject(err) : resolve(result)
        })
    })
}

/* 
* @function <b>createBooking </b> <br>
* validate inputs
* @return {json object} response
*/
module.exports.createBooking = (req, res) => {
    let schema = joi.object().keys({
        email: joi.string().email({ minDomainAtoms: 2}).required(),
        from_latitude: joi.number().precision(2).required(),
        from_longitude: joi.number().precision(2).required(),
        to_latitude: joi.number().precision(2).required(),
        to_longitude: joi.number().precision(2).required()
    })

    return new Promise((resolve, reject) => {
        joi.validate(req.body, schema, (err, result) => {
            (err) ? reject(err) : resolve(result)
        })
    })
}