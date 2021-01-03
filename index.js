var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const { body, validationResult, check } = require('express-validator')
const { resolveInclude } = require('ejs')

//imports list countries file
listCountries = require('./listCountries')

//imports list cities file
listCities = require('./listCities')

//imports list cities file
listHeads = require('./listHeads')

app.set('view engine', 'ejs') //sets view engine to ejs
app.use(bodyParser.urlencoded({ extended: false })) //now we can use the body parser



//on the / directory
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/menu.html")
})

//on the /listCountries directory
app.get('/listCountries', (req, res) => {
    listCountries.getCountries()
        .then((result) => {
            res.render('countriesTable', { countries: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//on the /listCities directory
app.get('/listCities', (req, res) => {
    listCities.getCities()
        .then((result) => {
            res.render('citiesTable', { cities: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//on the /allDetails page for a specific city
app.get('/allDetails/:city', (req, res) => {
    listCities.getCity(req.params.city)
        .then((result) => {
            res.render('cityDetails', { details: result })
        })
        .catch((error) => {
            res.send(error)
        })
})


//delete a country
app.get('/delete/:country', (req, res) => {
    listCountries.deleteCountry(req.params.country)
        .then((result) => {
            res.redirect("/listCountries")
        })
        .catch((error) => {
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h1>Error: Country " + req.params.country + " has cities, it cannot be deleted.</h1>")
            }
            else {
                res.send(error.message)
            }
        })
})


//on the update for a specific country
app.get('/updateCountry/:country', (req, res) => {
    listCountries.getCountry(req.params.country)
        .then((result) => {
            res.render("editCountry", { countries: result, errors: undefined })
        })
        .catch((error) => {
            res.send(error.message);
        })
})

//post for update country
app.post('/updateCountry',
    [check('coName').isLength({ min: 3 }).withMessage("Country name must be at least 3 characters")]
    , (req, res) => {
        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("editCountry", { errors: errors.errors, countries:errors.errors })
        }
        else {
        listCountries.updateCountry(req.body.coName, req.body.coDetails, req.body.coCode)
            .then((result) => {
                res.redirect("/listCountries")
                console.log("ok")
            })
            .catch((error) => {
                res.send("error")
            })
        }
    })


//get on the /addCountry page for a specific city
app.get('/addCountry', (req, res) => {
    res.render('addCountry', { errors: undefined })
})

//posts new country to database
app.post('/add',
    [check('coCode').isLength({ min: 3, max: 3 }).withMessage("Country code must be exactly 3 characters"),
    check('coName').isLength({ min: 3 }).withMessage("Country name must be at least 3 characters")],
    (req, res) => {
        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("addCountry", { errors: errors.errors })
        }
        else {
            listCountries.addCountry(req.body.coCode, req.body.coName, req.body.coDetails)
                .then((result) => {
                    res.redirect("/listCountries")
                })
                .catch((error) => {
                    if (error.code == "ER_DUP_ENTRY") {
                        res.send("<h1>Error: Country " + req.body.coCode + " already exists</h1>")
                    }
                    else {
                        res.send(error.message)
                    }
                })
        }

    })

//get on the /listHeads directory
app.get('/listHeads', (req, res) => {
    listHeads.getHeads()
        .then((documents) => {
            res.render('headsTable', { heads: documents })
            //console.log("ok")
        })
        .catch((error) => {
            res.send(error.message);
        })
})

//get on the /addHead page for a specific head
app.get('/addHeadPage', (req, res) => {
    res.render('addHead', { errors: undefined })
})

//adds head to database
app.post('/addHead',
    [check('_id').isLength({ min: 3, max: 3 }).withMessage("Country code must be exactly 3 characters"),
    check('headOfState').isLength({ min: 3 }).withMessage("Head of State must be at least 3 characters")],
    (req, res) => {

        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("addHead", { errors: errors.errors })
        }
        else {
            listHeads.addHead(req.body._id, req.body.headOfState)
                .then(() => {
                    res.redirect("/listHeads")
                })
                .catch((error) => {
                    res.send(error)
                })

        }
    })

//deletes head from the database
app.get('/deleteHead/:head', (req, res) => {
    listHeads.deleteHead(req.params.head)
        .then(() => {
            res.redirect("/listHeads")
        })
        .catch((error) => {
            res.send(error)
        })
})

//listening on port 4500
app.listen(4500, () => {
    console.log("Listening on port 4500")
}) 