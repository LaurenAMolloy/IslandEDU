const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    // educationLevel, enum: ["nursery", "primary","secondary"],
    // curriculum, enum: ["British", "IB","American", "Waldorf", "Montessori"]
})

module.exports = mongoose.model('School', SchoolSchema);