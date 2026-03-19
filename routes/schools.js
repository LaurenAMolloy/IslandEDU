const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const schools = require('../controllers/schools')
const { isLoggedIn, isAuthor, validateSchool } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const School = require('../models/school');

//Fancy way to route
router.route('/')
    .get(catchAsync(schools.index))
    // .post(isLoggedIn, validateSchool, catchAsync(schools.createSchool))
    .post(upload.single('image'),(req, res) => {
        console.log(req.body, req.file);
        res.send("IT WORKED");
    });

router.get('/new', isLoggedIn, schools.newForm);

router.route('/:id')
    .get(catchAsync(schools.showSchool))
    .put(isLoggedIn, isAuthor, validateSchool, catchAsync(schools.updateSchool))
    .delete(catchAsync(schools.deleteSchool));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(schools.editSchoolForm));

module.exports = router
