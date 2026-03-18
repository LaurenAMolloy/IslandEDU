const School = require('../models/school');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
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
}

module.exports.deleteReview = async( req, res) => {
    const { id, reviewId } = req.params
    await School.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
    //find the 1 review 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/schools/${id}`)
}