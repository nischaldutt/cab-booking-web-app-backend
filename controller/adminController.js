
//********** ADMIN CONTROLLER **********/

const adminHandler                  = require('../services/adminHandler')
const CONSTANTS                     = require('../properties/constants')
const bookingUtilities              = require('../utilities/bookingUtilities')

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
* @function <b> registerAdmins </b> <br>
* Register 2 admins to DB while starting server
*/
module.exports.registerAdmins = async (req, res, next) => {
    try {
        let registered = await adminHandler.alreadyRegistered();
        (registered) ?
        next():
        (await adminHandler.addNewCredentials(admins),
        next())
    } catch(err) {
        console.log(err)
    }
}

/* 
* @function <b> Login </b> <br>
* Admin login
*/
module.exports.login = async (req, res, next) => {
    try {
        let data = {
            email: req.body.email,
            password: req.body.password,
        }

        await adminHandler.checkIfAdminExists(data)
        next()
    } catch (err) {
        res.status(CONSTANTS.responseFlags.ACTION_NOT_ALLOWED).json(err)
    }
}

/* 
* @function <b> getAllBookings </b> <br>
* Admin gets all bookings in DB
*/
module.exports.getAllBookings = async (req, res, next) => {
    let result = await adminHandler.getAllBookings()
    return (result) ? res.status(CONSTANTS.responseFlags.ACTION_COMPLETE)
    .json(bookingUtilities.retrievedBookings(result)) : 
    res.status(CONSTANTS.responseFlags.NO_DATA_FOUND)
    .json(bookingUtilities.noBookingsFound())
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

        await adminHandler.checkIfDriverAssigned(driver_id)

        let admin_id = await adminHandler.getAdminId(req.body.email)
        //console.log(admin_id)
        let assigned = await adminHandler.assignBooking(admin_id, driver_id, booking_id)
        //console.log(assigned)
        res.status(CONSTANTS.responseFlags.ACTION_COMPLETE).json(assigned)
    } 
    catch(err) {
        res.status(CONSTANTS.responseFlags.DUPLICATE_ADDONS).json(err)
    }
}