const express=require("express");
const router=express.Router({mergeParams:true}); //mergeparams is a paramter used to obtain the values(parameter) in parent route(/:id/reviews{in app.js}) to children route(/:reviewId{in review.js})
const Listing=require("../models/listing.js");
const Review = require("../models/review.js");
const asyncWrap=require("../public/utils/asyncWrap.js");
const ExpressError=require("../public/utils/expressError.js");
const {reviewSchema}=require("../schema.js");
const  {isLoggedIn,isReviewAuthor}= require("../middleware.js"); 
const reviewController=require("../controllers/reviews.js");

   //VALIDATIONS FOR REVIEWS (SERVER SIDE)
   const validateReview = (req,res,next) =>{  //validating schema (to fill every value using server side like hopscotch,postman) using joi 
    let {error} =reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
   };


   
//POSTING REVIEWS TO LISTING SUBMITTED BY FORM
router.post("/",validateReview,isLoggedIn,asyncWrap(reviewController.createReview)); //passing validateReview method as middleware

 
                                     
 //DELETE REVIEWS
 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(reviewController.deleteReview));

 module.exports=router;