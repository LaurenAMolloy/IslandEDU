const mongoose = require('mongoose');
const School = require('../models/school');
const { schoolPrefixes, schoolConcepts, schoolTypes } = require('./seedHelpers')
const cities = require('./cities')

//Connect to Mongo
mongoose.connect('mongodb://localhost:27017/island-edu', {
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async() => {
    await School.deleteMany({})
    for(let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * cities.length);
        const city = cities[random]
        const school = new School({
            location: `${city.town}, ${city.district}`,
            title: `${sample(schoolPrefixes)} ${sample(schoolConcepts)} ${sample(schoolTypes)}`
        })
        await school.save()
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})
