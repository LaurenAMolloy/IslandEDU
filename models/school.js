const mongoose = require('mongoose');
const { schoolSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review');

const SchoolSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    // educationLevel, enum: ["nursery", "primary","secondary"],
    // curriculum, enum: ["British", "IB","American", "Waldorf", "Montessori"]
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

//WHATEVER IS DELETED WILL BE PASSED IN
//THIS IS A QUERY MIDDLEWARE!
SchoolSchema.post('findOneAndDelete', async function(doc) {
    console.log("DELETED")
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('School', SchoolSchema);