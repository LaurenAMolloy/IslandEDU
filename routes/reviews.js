const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const School = require('../models/school');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

//Reviews
// POST /schools/:id/reviews
router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const school = await School.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    review.school = school._id;
    school.reviews.push(review._id);
    //Series not parallel
    await review.save();
    await school.save();
    req.flash('success', 'Created a new review')
    res.redirect(`/schools/${school._id}`)
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async( req, res) => {
    const { id, reviewId } = req.params
    await School.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
    //find the 1 review 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/schools/${id}`)
}));

module.exports = router;