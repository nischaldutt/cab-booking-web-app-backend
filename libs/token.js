/******* JWT TOKEN *******/

const jwt                       = require('jsonwebtoken')

const CONSTANTS                 = require('../properties/constants')
const connection                = require('../database/mysql')

const privateKey = 'secret'

/* 
* @function <b>extractToken </b> <br>
* extract token from db
* @param {Object} obj
* @param {Table} tableName
* @return {json object} response
*/
let extractToken = (obj, tableName, res) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT token FROM ${tableName} WHERE email = ? `, obj.email, (err, result) => {
            (result[0] === undefined) ? 
            res.status(CONSTANTS.responseFlags.USER_NOT_FOUND).send({
                data: {
                    error: 'Not registered!',
                },
                statusCode: CONSTANTS.responseFlags.USER_NOT_FOUND,
                message: `${tableName} not registered!`
            }) : resolve(result[0].token)
        })
    })   
}

/* 
* @function <b>createToken </b> <br>
* create token on login
* @param {String} email
* @return {json object} response
*/
module.exports.createToken = (tableName) => {
    return (req, res, next) => {
        let data = {
            email: req.body.email,
        }
    
        // create token
        let token = jwt.sign(data, privateKey)

        //update token in database
        connection.query(`UPDATE ${tableName} SET token='${token}' WHERE email='${data.email}'`, (err, result) => {
            (err) ? res.status(CONSTANTS.responseFlags.INVALID_EMAIL_ID).send({
                data: {
                    error: err.message,
                },
                statusCode: CONSTANTS.responseFlags.INVALID_EMAIL_ID,
                message: "Invalid credentials!"
            }) :
            res.status(CONSTANTS.responseFlags.LOGIN_SUCCESSFULLY).json({
                data: {
                    email: data.email,
                },
                statusCode: CONSTANTS.responseFlags.LOGIN_SUCCESSFULLY,
                message: "login successfull!"
            })
        })
    }    
}

/* 
* @function <b>accessToken </b> <br>
* access the stored token
* @param {String} tableName
* @return {json object} response
*/
module.exports.accessToken = (tableName) => {
    return async (req, res, next) => {
        try {
            let data = {
                email: req.body.email,
            }
            let token = await extractToken(data, tableName, res)

            jwt.verify(token, privateKey, (err, payload) => {
                (err) ? res.status(CONSTANTS.responseFlags.INVALID_ACCESS_TOKEN).json({
                    data: {
                        error: err.message,
                    },
                    statusCode: CONSTANTS.responseFlags.INVALID_ACCESS_TOKEN,
                    message: "Token Expired!"
                }) : res.locals.email = data.email
                next()
            })
        }
        catch(err) {
            res.status(CONSTANTS.responseFlags.INVALID_EMAIL_ID).json({
                data: {
                    error: err.message,
                },
                statusCode: CONSTANTS.responseFlags.INVALID_EMAIL_ID,
                message: "Invalid credentials!"
            })
        }
    }
}