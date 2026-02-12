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

function getRandom(min, max) {
    //get random number
    const rand = Math.random();
    //find diff
    const diff = max - min;
    //random bewteen 0 and diff
    const random = Math.round(diff * rand);
    
    const randInRange = random - min

    return randInRange
}

const seedDb = async() => {
    await School.deleteMany({})
    for(let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * cities.length);
        const price = getRandom(3000, 7000)
        const city = cities[random]
        const school = new School({
            location: `${city.town}, ${city.district}`,
            title: `${sample(schoolPrefixes)} ${sample(schoolConcepts)} ${sample(schoolTypes)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
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
