const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const School = require('../models/school');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

//Todo redirect the the form and show errors
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

     if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//Reviews
// POST /schools/:id/reviews
router.post('/', validateReview, catchAsync(async(req, res) => {
    const school = await School.findById(req.params.id);

    const review = new Review(req.body.review);
    review.school = school._id;

    school.reviews.push(review);
    //Series not parallel
    await review.save();
    await school.save();
    res.redirect(`/schools/${school._id}`)
}));

router.delete('/:reviewId', catchAsync(async( req, res) => {
    const { id, reviewId } = req.params
    await School.findByIdAndUpdate(id, {$pull: { review: reviewId } });
    //find the 1 review 
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/schools/${id}`)
}));

module.exports = router;