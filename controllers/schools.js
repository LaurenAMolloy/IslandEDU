const School = require('../models/school');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req, res) => {
        console.log("Schools route hit");
        const schools = await School.find({})
        console.log(schools);
        res.render('schools/index', {schools, location: "All"})
}

module.exports.newForm = (req, res) => {
    res.render('schools/new')
}

module.exports.createSchool = async(req, res, next) => {
    console.log("USER:", req.user);
    // console.log("SESSION:", req.session);

    // const geoData = await geoCoder.forwardGeocode({
    //     query: req.body.school.location,
    //     limit: 1
    // }).send();
    // console.log(geoData.body.features);
    // res.send("OK!")
    const school = new School(req.body.school);
    //This will make an array that includes objects with all the files and urls
    school.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    school.author = req.user._id;
    await school.save();
    console.log(school);
    req.flash('success', 'Successfully made a new school');
    res.redirect(`/schools/${school._id}`);  
}

module.exports.showSchool = async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(school)
    if(!school) {
        req.flash('error', 'Cannot find that school!' );
        return res.redirect('/schools');
    }
    res.render('schools/show', { school })  
}

module.exports.editSchoolForm = async(req, res) => {
    const { id } = req.params
    const school = await School.findById(id)
    if(!school){
        req.flash('error', 'Cannot find that campground!')
    }
    //Are you allowed to update?
    if(!school.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do That!')
        res.redirect(`/schools/${id}`)
   }
    res.render('schools/edit', { school })
}

module.exports.updateSchool = async(req, res) => {
   const { id } = req.params;
   
   //const geoData = await maptilerClient.geocoding.forward(req.body.school.location, { limit: 1 });

    // console.log(geoData);
    // if (!geoData.features?.length) {
    //     req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
    //     return res.redirect(`/schools/${id}/edit`);
    // }
   //This is not a good way to update!
   //We have already found the campground so need to do this better
   const school = await School.findByIdAndUpdate(id, { ...req.body.school });

    // school.geometry = geoData.features[0].geometry;
    // school.location = geoData.features[0].place_name;

   //Turn the images into an array
   const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
   //Push the images into the image array
   school.images.push(...imgs);
   await school.save();

   //Handle Deletions
   if(req.body.deleteImages){
    //Delete from Cloudinary
    for(let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename)
    }
    //Remove from DB
     await school.updateOne({ $pull: {images: {filename: {$in: req.body.deleteImages}}}})
   }
   req.flash('success', 'Successfully updated school');
   res.redirect(`/schools/${school._id}`)
}

module.exports.deleteSchool = async(req, res) => {
    const { id } = req.params;
    const school = await School.findByIdAndDelete(id);
    res.redirect('/schools')
}