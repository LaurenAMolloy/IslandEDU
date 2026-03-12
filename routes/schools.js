const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { schoolSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const School = require('../models/school');

const validateSchool = (req, res, next) => {
    
    const { error } = schoolSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//GET all schools
router.get("/", catchAsync(async (req, res) => {
        console.log("Schools route hit");
        const schools = await School.find({})
        res.render('schools/index', {schools, location: "All"})
}))

//Create is two routes!
//Why?
//GET the form
router.get('/new',async(req, res) => {
    res.render('schools/new')
})

//POST the data
//Add the catch Async function
router.post('/', validateSchool, catchAsync(async(req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Data', 400);
    const school = new School(req.body.school);
    await school.save();
    req.flash('success', 'Successfully made a new school');
    res.redirect(`/schools/${school._id}`);  
}))

//GET school by id
router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id).populate('reviews')
    if(!school) {
        req.flash('error', 'Cannot find that school!' );
        return res.redirect('/schools');
    }
    res.render('schools/show', { school })  
}))

//Update School by ID
router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id)
    res.render('schools/edit', { school })
}));

router.put('/:id', validateSchool, catchAsync(async(req, res) => {
   const { id } = req.params;
   const school = await School.findByIdAndUpdate(id, { ...req.body.school })
   req.flash('success', 'Successfully updated school');
   res.redirect(`/schools/${school._id}`)
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const school = await School.findByIdAndDelete(id);
    res.redirect('/schools')
}));

module.exports = router
