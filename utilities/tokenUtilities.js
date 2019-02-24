const CONSTANTS                         = require('../properties/constants')

module.exports.notLogin = (tableName) => {
    return {
        data: {
            error: 'No token generated!',
        },
        statusCode: CONSTANTS.responseFlags.USER_NOT_FOUND,
        message: `Please login first`
    }
}

module.exports.tokenExpired = (err) => {
    return {
        data: {
            error: err.message,
        },
        statusCode: CONSTANTS.responseFlags.INVALID_ACCESS_TOKEN,
        message: "Token Expired!"
    }
}

module.exports.invalidCredentials = (err) => {
    return {
        data: {
            error: err.message,
        },
        statusCode: CONSTANTS.responseFlags.INVALID_EMAIL_ID,
        message: "Invalid credentials!"
    }
}