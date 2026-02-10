const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const School = require('./models/school')

//Connect to Mongo
mongoose.connect('mongodb://localhost:27017/island-edu', {
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const app = express();

app.set('view engine', 'ejs');
//absolute path /Users/you/projects/island-edu/views
//builds safely
//bullet proof path
app.set('views', path.join(__dirname, 'views'));

app.get("/", (res, req) => {
    res.render('home')
})

//GET all schools
app.get("/schools", async (req, res) => {
    const schools = await School.find({})
    res.render('schools/index', {schools})
})

//GET school by id
app.get('/schools/:id', async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id)
    res.render('schools/show', { school })  
})

//Create is two routes!


app.listen(8000, ()=> {
    console.log("Listening on Port 8000")
})