const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { schoolSchema } = require('./schemas.js');
const { reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const School = require('./models/school');
const Review = require('./models/review');

const schools = require('./routes/schools.js');
const review = require('./routes/reviews.js')

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

app.use('/schools', schools );
app.use('/schools/:id/reviews', review);

// app.get("/", (req, res) => {
//     res.render('home')
// });

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