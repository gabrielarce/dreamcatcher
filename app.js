const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;
const path = require("path");
const mongoose = require('mongoose');
const connectDB = require('./config/database')
const dreamRoutes = require('./routes/dreams')
require("dotenv").config();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

connectDB();
const Dream = require('./models/Dream')

app.get("/", (request, response) => {
    response.render('index')
})

app.use('/api/dreams', dreamRoutes)

app.listen(PORT, () => {
    console.log('listening on port 9000')
})