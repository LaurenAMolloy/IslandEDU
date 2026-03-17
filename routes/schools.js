const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const School = require('../models/school');
const { isLoggedIn, isAuthor, validateSchool } = require('../middleware');


//GET all schools
router.get("/", catchAsync(async (req, res) => {
        console.log("Schools route hit");
        const schools = await School.find({})
        res.render('schools/index', {schools, location: "All"})
}))

//Create is two routes!
//Why?
//GET the form
console.log(typeof isLoggedIn)
router.get('/new', isLoggedIn, (req, res) => {
    res.render('schools/new')
})

//POST the data
//Add the catch Async function
//User now has to be loggedin to access the create school
router.post('/', isLoggedIn, validateSchool, catchAsync(async(req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Data', 400);
    const school = new School(req.body.school);
    school.author = req.user._id;
    await school.save();
    req.flash('success', 'Successfully made a new school');
    res.redirect(`/schools/${school._id}`);  
}))

//GET school by id
router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id).populate('reviews').populate('author');
    console.log(school)
    if(!school) {
        req.flash('error', 'Cannot find that school!' );
        return res.redirect('/schools');
    }
    res.render('schools/show', { school })  
}))

//Update School by ID
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id)
    if(!school){
        req.flash('error', 'Cannot find that campground!')
    }
    //Are you allowed to update?
    if(!school.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do That!')
        res.redirect(`/schools/${id}`)
   }
    res.render('schools/edit', { school })
}));

router.put('/:id', isLoggedIn, isAuthor, validateSchool, catchAsync(async(req, res) => {
   const { id } = req.params;
   //Find the school
   const school = await School.findbyId(id);
   //Are you allowed to update?
   if(!school.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do That!')
        res.redirect(`/schools/${id}`)
   }
   //This is not a good way to update!
   //We have already found the campground so need to do this better
   const schools = await School.findByIdAndUpdate(id, { ...req.body.school })
   req.flash('success', 'Successfully updated school');
   res.redirect(`/schools/${school._id}`)
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const school = await School.findByIdAndDelete(id);
    res.redirect('/schools')
}));

module.exports = router
