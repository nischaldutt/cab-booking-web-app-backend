//********** ADMIN CONTROLLER **********/

const adminHandler                  = require('../services/adminHandler')
const CONSTANTS                     = require('../properties/constants')

const admins = [
    {
        username: 'admin01',
        email: 'admin01@gmail.com',
        password: '123456'
    },
    {
        username: 'admin02',
        email: 'admin02@gmail.com',
        password: '123456'
    }
]

/* 
* @function <b> Login </b> <br>
* Admin login
*/
module.exports.login = async (req, res, next) => {
    let data = {
        username: admins[0].username,
        email: admins[0].email,
        password: admins[0].password,
    }

    await adminHandler.checkIfAdminExists(data)
    next()
}

/* 
* @function <b> getAllBookings </b> <br>
* Admin gets all bookings in DB
*/
module.exports.getAllBookings = async (req, res, next) => {
    let result = await adminHandler.getAllBookings()
    return (result) ? res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json({
        data: {
            bookings: result
        },
        statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
        message: "Retrieved all bookings!"
    }) : res.status(CONSTANTS.responseFlags.NO_DATA_FOUND).json({
        data: {
            bookings: {}
        },
        statusCode: CONSTANTS.responseFlags.NO_DATA_FOUND,
        message: "No data found!"
    })
}

/* 
* @function <b>assignBooking </b> <br>
* Admin assigns booking to driver
* @param {Integer} driver_id
* @return {json object} response
*/
module.exports.assignBooking = async (req, res, next) => {
    try{
        let driver_id = req.body.driver_id
        let booking_id = req.body.booking_id

        let admin_id = await adminHandler.getAdminId(res.locals.email, res)

        adminHandler.assignBooking(admin_id, driver_id, booking_id, (err, result) => {
            return (result) ? res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json({
                data: {
                    admin_id: admin_id,
                    booking_id: booking_id,
                    driver_id: driver_id
                },
                statusCode: CONSTANTS.responseFlags.ACTION_COMPLETE,
                message: 'Booking assigned!'
            }) : res.status(CONSTANTS.responseFlags.ERROR_IN_EXECUTION).json({
                data: {
                    admin_id: admin_id,
                    booking_id: booking_id,
                    driver_id: driver_id
                },
                statusCode: CONSTANTS.responseFlags.ERROR_IN_EXECUTION,
                message: "Cannot assign booking!"
            })
        })
    } 
    catch(err) {
        res.status(CONSTANTS.responseFlags.DUPLICATE_ADDONS).json({
            data: {
                driver_id: req.body.driver_id,
            },
            statusCode: CONSTANTS.responseFlags.DUPLICATE_ADDONS,
            message: 'Driver already assigned!'
        })
    }
}
