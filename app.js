const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
//absolute path /Users/you/projects/island-edu/views
//builds safely
//bullet proof path
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get("/", (res, req) => {
    res.render('home')
})

//GET all schools
app.get("/schools", async (req, res) => {
    const schools = await School.find({})
    res.render('schools/index', {schools})
})

//Create is two routes!
//Why?
//GET the form
app.get('/schools/new', async(req, res) => {
    res.render('schools/new')
})

//POST the data
app.post('/schools', async(req, res) => {
    const school = new School(req.body.school)
    await school.save()
    res.redirect(`/schools/${school._id}`)
})

//GET school by id
app.get('/schools/:id', async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id)
    res.render('schools/show', { school })  
})

//Update School by ID
app.get('/schools/:id/edit', async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id)
    res.render('schools/edit', { school })
});

app.put('/schools/:id', async(req, res) => {
   const { id } = req.params;
   const school = await School.findByIdAndUpdate(id, { ...req.body.school })
   res.redirect(`/schools/${school._id}`)
})

app.delete('/schools/:id', async(req, res) => {
    const { id } = req.params;
    const school = await School.findByIdAndDelete(id);
    res.redirect('/schools')
})

app.listen(8000, ()=> {
    console.log("Listening on Port 8000")
})