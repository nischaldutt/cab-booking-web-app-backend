const CONSTANTS                         = require('../properties/constants')

module.exports.bookingAssigned = (admin_id, driver_id, booking_id) => {
    return {
        data: {
            admin_id: admin_id,
            booking_id: booking_id,
            driver_id: driver_id
        },
        statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
        message: 'Booking assigned!'
    }
}

module.exports.noBooking = (admin_id, driver_id, booking_id) => {
    return {
        data: {
            admin_id: admin_id,
            booking_id: booking_id,
            driver_id: driver_id
        },
        statusCode: CONSTANTS.responseFlags.ERROR_IN_EXECUTION,
        message: "Cannot assign booking!"
    }
}

module.exports.driverAlreadyAssigned = (driver_id) => {
    return {
        data: {
            driver_id: driver_id,
        },
        statusCode: CONSTANTS.responseFlags.DUPLICATE_ADDONS,
        message: 'Driver already assigned!'
    }
}

module.exports.adminDoesNotExists = () => {
    return {
        data: {
            error: "admin doesnot exists"
        },
        statusCode: CONSTANTS.responseFlags.USER_NOT_FOUND,
        message: "Cannot assign booking!"
    }
}

module.exports.retrievedBookings = (result) => {
    return {
        data: {
            bookings: result
        },
        statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
        message: "Retrieved all bookings!"
    }
}

module.exports.noBookingsFound = () => {
    return {
        data: {
            bookings: {}
        },
        statusCode: CONSTANTS.responseFlags.NO_DATA_FOUND,
        message: "No data found!"
    }
}