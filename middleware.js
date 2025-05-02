const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
const ExpressError=require("./public/utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js")
module.exports.isLoggedIn=(req,res,next)=>{
   
    if(!req.isAuthenticated()){   // isauthenticated method checks if a user is logined or not
        req.session.redirectURL=req.originalUrl; // the path triggered will be stored(if the user is not logged in then the path user is trying to open asks to login )
    
        
        req.flash("error","you need to login ");
        return res.redirect("/login");
     }
     next();
}

module.exports.saveRedirectURL=(req,res,next)=>{

    if(req.session.redirectURL) {
        res.locals.redirectURL=req.session.redirectURL;
        
    }

    next();

}

module.exports.isOwner=async(req,res,next)=>{
    const {id} =req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
       req.flash("error","you don't have permission to perform this action");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId} =req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
       req.flash("error","you don't have permission to perform this action");
       return res.redirect(`/listings/${id}`);
    }
    next();
}