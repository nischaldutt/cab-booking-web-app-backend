<div>
  <h1 align="center">
    <a href="https://github.com/nischaldutt/cab-booking-web-app-backend">Backend Of A Cab Booking Web App 🚕</a>
  </h1>
  <strong>
    
  </strong>
  <p>
    Server built with Node's 
    <a href="https://expressjs.com/">Express.js</a>,  along with 
    <a href="https://www.npmjs.com/package/mysql">MySQL</a> and 
    <a href="https://www.npmjs.com/package/mongodb">MongoDB</a> to store data and logs and simulates 
    complete basic backend of a cab booking application.
  </p>
</div>

<hr />

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/nischaldutt/cab-booking-web-app-backend)
[![GNU Licence](https://img.shields.io/badge/Licence-GNU-blue)](https://github.com/nischaldutt/cab-booking-web-app-backend)

## [Open in Visual Studio Code 👨‍💻](https://vscode.dev/github.com/nischaldutt/cab-booking-web-app-backend/)

## Features

- 🚖 Complete backend including basic API's of customer, driver(fleet) and admin.
- 🏗️ Developed and implemented REST web services in MVC friendly codebase structure.
- 📊 The application is fully capable of manipulating all input data, process it, and then store it in relational database server.
- 📍 Designed location services for the application by utilizing MySQL’s geo-spatial queries.
- 🔑 Authorized requests
- 🔐 Password encryption
- ✔️ User input validation
- ⚠️ Error handling
- 📄 API Documentation

### Swagger Dashboard

<div>
    <img
      alt="Swagger dashboard"
      src="https://i.imgur.com/hpgOddV.png"
    />
</div>

### Database Schema

<div>
    <img
      alt="Database Schema"
      src="https://i.imgur.com/rIf5875.png"
    />
</div>

### Sample Request in swagger

<div>
    <img
      alt="Sample Request"
      src="https://i.imgur.com/X7ORuoz.png"
    />
</div>

### Sample response from request in swagger

<div>
    <img
      alt="Sample Response"
      src="https://i.imgur.com/BgOa8k9.png"
    />
</div>

## Packages Used

- Server: [Express.js](https://expressjs.com/)
- Promise Library: [Bluebird](https://www.npmjs.com/package/bluebird)
- Request Parsing: [BodyParser](https://www.npmjs.com/package/body-parser)
- Password Encryption: [Bcrypt](https://www.npmjs.com/package/bcrypt)
- Input Validation: [Joi](https://www.npmjs.com/package/joi)
- Authorization: [JSON Web Tokens](https://www.npmjs.com/package/joi)
- Real-time alerts: [Socket.io](http://socket.io/)
- Date/Time: [Node-DateTime](https://www.npmjs.com/package/node-datetime)
- Error Handling: [Boom](https://www.npmjs.com/package/boom)
- API Documentation: [Swagger-UI](https://swagger.io/tools/swagger-ui/)

## Databases

- Primary database to store all information related to admins, bookings, customers and fleets: [MySQL](https://www.npmjs.com/package/mysql)
- Server Cache: [Redis](https://www.npmjs.com/package/redis)
- Server logs: [MongoDB](https://www.npmjs.com/package/mongodb)

## API Reference

| Endpoint                   | Type | Description                          |
| :------------------------- | :--- | :----------------------------------- |
| `/customer/register`       | POST | Register a new customer              |
| `/customer/login`          | POST | Sign in the customer account         |
| `/customer/create-booking` | POST | Customer creates a new booking       |
| `/customer/view-booking`   | GET  | Get information of created booking   |
| `/driver/register`         | POST | Register a new driver                |
| `/driver/login`            | POST | Sign in the driver account           |
| `/driver/complete-booking` | PUT  | Driver completes the ongoing booking |
| `/admin/login`             | POST | Sign in the admin account            |
| `/admin/assign-booking`    | PUT  | Admin assigns a booking manually     |
| `/admin/get-all-bookings`  | GET  | Get all bookings                     |

### Responses

API endpoints return the JSON representation of the resources created or edited.

```javascript
{
  "message" : string,
  "status"  : number,
  "data"    : string
}
```

The `message` attribute contains a message commonly used to indicate errors or, in the case of deleting a resource, success that the resource was properly deleted.

The `status` attribute describes if the transaction was successful or not.

The `data` attribute contains any other metadata associated with the response. This will be an escaped string containing JSON data.

### Status Codes

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |
