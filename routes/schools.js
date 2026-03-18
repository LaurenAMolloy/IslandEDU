const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const schools = require('../controllers/schools')
const { isLoggedIn, isAuthor, validateSchool } = require('../middleware');

const School = require('../models/school');

//GET all schools
router.get("/", catchAsync(schools.index));

//Create is two routes!
//Why?
//GET the form
//console.log(typeof isLoggedIn)
router.get('/new', isLoggedIn, schools.newForm);

//POST the data
//Add the catch Async function
//User now has to be loggedin to access the create school
router.post('/', isLoggedIn, validateSchool, catchAsync(schools.createSchool))

//GET school by id
router.get('/:id', catchAsync(schools.showSchool))

//Update School by ID
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(schools.editSchoolForm));

router.put('/:id', isLoggedIn, isAuthor, validateSchool, catchAsync(schools.updateSchool))

router.delete('/:id', catchAsync(schools.deleteSchool));

module.exports = router
