const { schoolSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const school = require('./models/school');


module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user)
    if(!req.isAuthenticated()) {
        //Store the URL of the page
        //console.log(req.path, req.originalUrl)
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateSchool = (req, res, next) => {
    
    const { error } = schoolSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const school = await School.findById(id);
    //Does the authors id match the user id?
    if(!school.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do That!')
        res.redirect(`/schools/${id}`)
   }
   next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

     if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}