
/******* BCRYPT *******/

const bcrypt                        = require('bcrypt')
const CONSTANTS                     = require('../properties/constants')

/* 
* @function <b>hashPassword </b> <br>
* hash the input password
* @return {hash} hashPass
*/
exports.hashPassword = async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)
    exports.hashPass = hash
    next()
}

/* 
* @function <b>matchPassword </b> <br>
* match input passwor with hashed password
* @param {String} plainText
* @param {String} hashPassword
* @return {json object} response
*/
exports.matchPassword = (plainText, hashPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, hashPassword, (err, result) => {
            (result) ? resolve(result) : reject(result)
        })
    })
}