const CONSTANTS                         = require('../properties/constants')

module.exports.customerAlreadyExists = (err, result) => {
    return {
        data: {
            err: err,
            result: `${result[0].username} already exists!`,
        },
        statusCode: CONSTANTS.responseFlags.DUPLICATE_ADDONS,
        message: "Customer already registered!"
    }
}

module.exports.newCustomerAdded = (customer) => {
    return {
        data: {
            username: `${customer.username} added to DB!`,
        },
        statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
        message: "Customer registered!"
    }
}

module.exports.customerNotRegistered = (name) => {
    return {
        data: {
            name: name,
        },
        statusCode: CONSTANTS.responseFlags.ACTION_NOT_ALLOWED,
        message: "Customer not registered!"
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

module.exports.bookingCreated = (customer) => {
    return {
        data: {
            customer_id: customer.customer_id,
        },
        statusCode: CONSTANTS.responseFlags.ADDON_INSERTED,
        message: 'Booking created!'
    }
}

module.exports.bookngFailed = (customer) => {
    return {
        data: {
            customer_id: customer.customer_id,
        },
        statusCode: CONSTANTS.responseFlags.ADDON_DEACTIVATED,
        message: 'Booking failed!'
    }
}

module.exports.noBookingsavailable = () => {
    return {
        data: {
            error: 'No bookings created by customer!',
        },
        statusCode: CONSTANTS.responseFlags.USER_NOT_FOUND,
        message: "Pleases make some bookings!"
    }
}

module.exports.allBookings = (bookings) => {
    return {
        data: {
            bookings: bookings
        },
        statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
        message: "Got all bookings done by customer!"
    }
}