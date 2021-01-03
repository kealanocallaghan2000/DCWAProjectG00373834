 const MongoClient = require('mongodb').MongoClient;

 const url = 'mongodb://localhost:27017'

 const dbName = 'headsOfStateDB'
 const collName = 'headsOfState'

 //db variables
 var headsOfStateDB
 var headsOfState

 //connecting to mongo
 MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
            .then((client) =>{
                headsOfStateDB = client.db(dbName)
                headsOfState = headsOfStateDB.collection(collName)
            })
            .catch((error) =>{
                console.log(error)
            })

//function for retrieving the heads of state
var getHeads = function() {
    return new Promise((resolve, reject) => {
        var cursor = headsOfState.find()
        cursor.toArray()
        .then((documents) => {
             resolve(documents)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

//function for adding a head of state
var addHead = function(_id, headOfState) {
    return new Promise((resolve, reject) => {
        headsOfState.insertOne({"_id":_id, "headOfState": headOfState})
                    .then((result) =>{
                        resolve(result)
                        //console.log("ok")
                    })
                    .catch((error) =>{
                        reject(error)
                    })
    })
}

//function to delete country
var deleteHead = function(_id) {
    return new Promise((resolve, reject) => {

        headsOfState.deleteOne({"_id":_id})
            .then((result) => {
                resolve(result)
                console.log("ok")
            })
            .catch((error) => {
                reject(error)
                console.log("nok")
            })
    
    })
}

module.exports = { getHeads, addHead, deleteHead }