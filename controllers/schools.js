const School = require('../models/school');

module.exports.index = async (req, res) => {
        console.log("Schools route hit");
        const schools = await School.find({})
        res.render('schools/index', {schools, location: "All"})
}

module.exports.newForm = (req, res) => {
    res.render('schools/new')
}

module.exports.createSchool = async(req, res, next) => {
    const school = new School(req.body.school);
    school.image = req.files.map(file => ({ url: file.path, filename: file.filename }))
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
   //Find the school
   const school = await School.findbyId(id);
   //Are you allowed to update?
   if(!school.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do That!')
        res.redirect(`/schools/${id}`)
   }
   //This is not a good way to update!
   //We have already found the campground so need to do this better
   const schools = await School.findByIdAndUpdate(id, { ...req.body.school })
   req.flash('success', 'Successfully updated school');
   res.redirect(`/schools/${school._id}`)
}

module.exports.deleteSchool = async(req, res) => {
    const { id } = req.params;
    const school = await School.findByIdAndDelete(id);
    res.redirect('/schools')
}