if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const helmet = require('helmet');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const userRoutes = require('./routes/users')
const schoolsRoutes = require('./routes/schools');
const reviewsRoutes = require('./routes/reviews');
const session = require('express-session');

//const dbUrl = process.env.DB_URL

//Connect to Mongo
mongoose.connect('mongodb://localhost:27017/island-edu');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const app = express();
app.set('query parser', 'extended');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
//absolute path /Users/you/projects/island-edu/views
//builds safely
//bullet proof path
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitizeV5({ replaceWith: '_' }));


//const { MongoStore } = require('connect-mongo');

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     //Lazy update the session
//     //If the data has not changed do not update
//     //Only once every 24 hrs
//     touchAfter: 24 * 60 * 60,
//     crypto: {
//         secret: 'thisshouldbeabettersecret!'
//     }
// });

// store.on("error", function(e) {
//     console.log("SESSION STORE ERROR", e)
// })

const sessionConfig = {
    //store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    //Cookie not accessible via JS
    cookie: {
        httpOnly: true,
        //secure: true
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://api.mapbox.com/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://api.mapbox.com/",
  "https://cdnjs.cloudflare.com/"
];
const connectSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://api.mapbox.com/",
    "https://events.mapbox.com/",
    "https://docs.mapbox.com"
];
const fontSrcUrls = [
    "https://fonts.gstatic.com/",
    "https://api.mapbox.com/",
    "https://cdnjs.cloudflare.com/",
    "https://use.fontawesome.com/",
    "https://cdn.maptiler.com/",
    "https://cdn.jsdelivr.net/"
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/",
        "https://images.unsplash.com/",
        "https://api.mapbox.com/",

      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //console.log(req.session)
    //console.log(req.query)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeuser',  async (req, res) => {
    const user = new User({ email: 'lauren@gmail.com', username: 'lauren' })
    //PASS IN USER AND PASSWORD
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/', userRoutes)
app.use('/schools', schoolsRoutes );
app.use('/schools/:id/reviews', reviewsRoutes);

app.get("/", (req, res) => {
    res.render('home')
});

//This is a catch all route
app.all(/(.*)/, (req, res, next) => {
    console.log('404', req.originalUrl)
    //This will trigger an error in the route!
    next(new ExpressError('Page Not Found', 404))
})

//I only run when there is an error!
app.use((err, req, res, next ) => {
    console.log(err); 
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode).render('error', { err });
    //res.send("Oh boy something went wrong!")
})

app.listen(8000, ()=> {
    console.log("Listening on Port 8000")
})