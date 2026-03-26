const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const schools = require('../controllers/schools')
const { isLoggedIn, isAuthor, validateSchool } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const School = require('../models/school');

//isLoggedIn
//Fancy way to route
router.route('/')
    .get(catchAsync(schools.index))
    .post(upload.array('image'), validateSchool, catchAsync(schools.createSchool))
    

router.get('/new', isLoggedIn, schools.newForm);

router.route('/:id')
    .get(catchAsync(schools.showSchool))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateSchool, catchAsync(schools.updateSchool))
    .delete(catchAsync(schools.deleteSchool));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(schools.editSchoolForm));

module.exports = router
