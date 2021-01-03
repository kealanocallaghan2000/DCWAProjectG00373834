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

//function to retrieve from db
var getCities = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city;')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//function to return singular city
var getCity = function (cityCode) {
    return new Promise((resolve, reject) => {
        pool.query('select c.cty_code, c.co_code, c.cty_name, c.population, c.isCoastal, c.areaKM, co.co_name from city c inner join country co on c.co_code = co.co_code where c.cty_code = "' + cityCode + '"')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


//exports
module.exports = { getCities, getCity }