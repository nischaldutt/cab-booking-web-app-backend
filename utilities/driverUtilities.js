const CONSTANTS                      = require('../properties/constants')

module.exports.driverAlreadyExists = (err, result) => {
    return {
        data: {
            err: err,
            result: `${result[0].username} already exists!`,
        },
        statusCode: CONSTANTS.responseFlags.DUPLICATE_ADDONS,
        message: "Driver already registered!"
    }
}

module.exports.newDriverAdded = (driver) => {
    return {
        data: {
            username: `${driver.username} added to DB!`,
        },
        statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
        message: "Driver registered!"
    }
}

module.exports.driverNotRegistered = (name) => {
    return {
        data: {
            name: name,
        },
        statusCode: CONSTANTS.responseFlags.ACTION_NOT_ALLOWED,
        message: "Driver not registered!"
    }
}

module.exports.loginSuccessfull = (customer) => {
    return {
        data: {
            email: customer.email,
        },
        statusCode: CONSTANTS.responseFlags.LOGIN_SUCCESSFULLY,
        message: 'Login Successfull!'
    }
}

module.exports.incorrectPassword = () => {
    return {
        data: {
            message: `Password incorrect!`
        },
        statusCode: CONSTANTS.responseFlags.WRONG_PASSWORD,
        message: 'Please enter correct password!'
    }
}

module.exports.bookingCompleted = (driver_id, booking_id, email) => {
    return {
        data: {
            booking_id: booking_id,
            driver_id : driver_id,
        },
        statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
        message: "Booking completed!"
    }
}

module.exports.allBookings = (result) => {
    return {
        data: {
            result
        },
        statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
        message: "Get all Bookings driver!"
    }
}