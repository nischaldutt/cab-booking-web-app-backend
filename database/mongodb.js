/******* MONGO DB CONNECTION *******/

const MongoClient             = require('mongodb').MongoClient
const ObjectID                = require('mongodb').ObjectID

const dbName                  = 'appDB'
const url                     = 'mongodb://localhost:27017';
const mongoOptions            = { useNewUrlParser: true }

//STATE OF MONGODB
const state = {
  db: null
}

// Use connect method to connect to the server
const connect = (callback) => {
  if(state.db) {
    callback()
  }
  else {
    MongoClient.connect(url, mongoOptions, (err, client) => {
      if(err) {
        callback(err) 
      }
      else {
        state.db = client.db(dbName)
        callback()
      }
    })
  }
}

const getPrimaryKey = (_id) => {
  return ObjectID()
}

const getDB = () => {
  return state.db
}

module.exports                = {getDB, connect, getPrimaryKey}