const mongoose = require('mongoose');
const School = require('../models/school');
const { schoolPrefixes, schoolConcepts, schoolTypes } = require('./seedHelpers')
const cities = require('./cities');
const User = require('../models/user');

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

function getRandom(min, max) {
    //Math.random 0 (inclusive) → 1 (exclusive) something like 0.12
    let random = Math.floor(Math.random() * (max - min + 1)) + min
    return random
}

const seedDb = async() => {
    await School.deleteMany({})
    for(let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * cities.length);
        const price = getRandom(3000, 10000)
        const city = cities[random]
        const school = new School({
            author: '69c6b5274a16f68ac4abc5a4',
            location: `${city.town}, ${city.district}`,
            //  geometry: {
            //     type: "Point",
            //     coordinates: [
            //         city.longitude,
            //         city.latitude,
            //     ]
            // },
            title: `${sample(schoolPrefixes)} ${sample(schoolConcepts)} ${sample(schoolTypes)}`,
            images: [
            {
            url: 'https://res.cloudinary.com/du8pswahs/image/upload/v1774851692/IslandEdu/csepkjqgjkhhva03icee.jpg',
            filename: 'IslandEdu/csepkjqgjkhhva03icee',
            },
            {
            url: 'https://res.cloudinary.com/du8pswahs/image/upload/v1774851693/IslandEdu/skbsjq2qurhnzv0z6qag.jpg',
             filename: 'IslandEdu/skbsjq2qurhnzv0z6qag',            }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis quibusdam quo eligendi ab harum, officia consequuntur expedita ipsam amet tempora adipisci neque at animi, cupiditate fuga. Recusandae eius consequatur aspernatur.',
            price: price,

        })
        await school.save()
    }
    console.log("Seeding complete");
}

seedDb().then(() => {
    mongoose.connection.close();
})
