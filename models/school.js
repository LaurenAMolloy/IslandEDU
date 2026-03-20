const mongoose = require('mongoose');
const { schoolSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_200,c_fill')
});

const SchoolSchema = new Schema({
    title: String,
    price: Number,
    image: [ ImageSchema ],
    description: String,
    location: String,
    // educationLevel, enum: ["nursery", "primary","secondary"],
    // curriculum, enum: ["British", "IB","American", "Waldorf", "Montessori"]
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('School', SchoolSchema);