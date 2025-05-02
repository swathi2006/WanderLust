const Review = require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    
    let listing=await Listing.findById(req.params.id);
    let data=req.body.review
    let newReview = new Review(data);
    newReview.author=req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
  
     req.flash("success","Review is created");
     res.redirect(`/listings/${listing._id}`);
 }

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});  // object id of deleted review will be deleted from reviews array in listing
    await Review.findByIdAndDelete(reviewId);

    req.flash("deletion","Review Deleted");
    res.redirect(`/listings/${id}`);
}