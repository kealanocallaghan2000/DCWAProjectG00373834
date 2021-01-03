var mysql = require('promise-mysql')

var pool

//creates a pool for our sql database
mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'jedward2010',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    })

//function to retrieve countries from db
var getCountries = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from country;')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//function to retrieve 1 country from db
var getCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        pool.query('select * from country where co_code = "' + co_code + '"')
            .then((result) => {
                resolve(result)
                //console.log(co_code)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


//function to delete country
var deleteCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        pool.query('delete from country where co_code = "' + co_code + '"')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//function to add a country
var addCountry = function (coCode, coName, coDetails) {
    return new Promise((resolve, reject) => {

        pool.query('insert into country values ("' + coCode + '", "' + coName + '", "' + coDetails + '")')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
                console.log(error)
            })
    })
}


//function for updating the country
var updateCountry = function (coName, coDetails, coCode) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'update country set co_name = ?, co_details = ? where co_code = ?',
            values: [coName, coDetails, coCode]
        }

        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
                console.log(error)
            })

    })
}

//exports
module.exports = { getCountries, deleteCountry, addCountry, getCountry, updateCountry }