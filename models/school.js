const mongoose = require('mongoose');
const { schoolSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//A property that doesn’t exist in MongoDB, but is generated dynamically from other data
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_200,c_fill/')
});

const opts = { toJSON: { virtuals: true } };

const SchoolSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    // educationLevel, enum: ["nursery", "primary","secondary"],
    // curriculum, enum: ["British", "IB","American", "Waldorf", "Montessori"]
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // },
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
}, opts);

SchoolSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/schools/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
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