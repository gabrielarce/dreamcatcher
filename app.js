const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;
const path = require("path")
const MongoClient = require('mongodb').MongoClient
require("dotenv").config()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const connectionString = ""
let db,
    // Declare a variable and assign to our database connection string to it
    dbConnectionStr = process.env.DB_STRING,
    // Declare a variable and assign the name of the database we will be using
    dbName = 'dreams';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to the ${dbName} Database`)
        db = client.db(dbName)
    })
    .catch(error => console.error(error))

app.get("/", (request, response) => {
    console.log(__dirname)
    response.sendFile(__dirname + "/index.html")
})

app.get("/dreamDemo", async(request, response) => {
    const dreams = await db.collection('dreams').find().toArray()
    console.log(dreams)
    response.render('dreamDemo', { dreams })
})


// app.get("/dreams", (request, response) => {
//     response.sendFile(__dirname + "/dreamForm.html")
// })
// app.get('/api/dreams', async(request, response) => {
//     const dreams = await db.collection('dreams').find().toArray()
//         // .then(results => {
//         //     console.log(response)
//         //     console.log(results)
//         //     response.render('dreams.ejs', { dreams: results })
//         // })
//         // .catch(console.log("something went wrong!"))
//     console.log(dreams)
//         //Used shorthand of listing object property "dreams" to a varaiable with the same name
//     response.render('dreams.ejs', { dreams })

// })

app.post('/api/dreams', (request, response) => {
    const dreamsCollection = db.collection('dreams')
    dreamsCollection.insertOne(request.body)
        .then(result => {
            console.log(result)
            response.redirect("/dreamDemo")
        })
        .catch(error => console.error(error))
})


app.listen(PORT, () => {
    console.log('listening on port 9000')
})