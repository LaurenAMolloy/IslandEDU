const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { schoolSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const School = require('./models/school');

//Connect to Mongo
mongoose.connect('mongodb://localhost:27017/island-edu');

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
app.use(express.static('public'));

const validateSchool = (req, res, next) => {
    
    const { error } = schoolSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render('home')
})

//view by location
///schools?location=limassol
//GET all schools
app.get("/schools", catchAsync(async (req, res) => {
    // const { location } = req.query
    // if(location){
    //     const schools = await School.find({ location })
    //     res.render('schools/index', {schools, location})
    // } else {
        console.log("Schools route hit");
        const schools = await School.find({})
        res.render('schools/index', {schools, location: "All"})
    }))

//Create is two routes!
//Why?
//GET the form
app.get('/schools/new',async(req, res) => {
    res.render('schools/new')
})

//POST the data
//Add the catch Async function
app.post('/schools', validateSchool, catchAsync(async(req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Data', 400);
    const school = new School(req.body.school);
    await school.save();
    res.redirect(`/schools/${school._id}`);  
}))

//GET school by id
app.get('/schools/:id', catchAsync(async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id)
    res.render('schools/show', { school })  
}))

//Update School by ID
app.get('/schools/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id)
    res.render('schools/edit', { school })
}));

app.put('/schools/:id', validateSchool, catchAsync(async(req, res) => {
   const { id } = req.params;
   const school = await School.findByIdAndUpdate(id, { ...req.body.school })
   res.redirect(`/schools/${school._id}`)
}))

app.delete('/schools/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const school = await School.findByIdAndDelete(id);
    res.redirect('/schools')
}));

//This is a catch all route
app.all(/(.*)/, (req, res, next) => {
    console.log('404', req.originalUrl)
    //This will trigger an error in the route!
    next(new ExpressError('Page Not Found', 404))
})

//I only run when there is an error!
app.use((err, req, res, next ) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode).render('error', { err });
    //res.send("Oh boy something went wrong!")
})

app.listen(8000, ()=> {
    console.log("Listening on Port 8000")
})