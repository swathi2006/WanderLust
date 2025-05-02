const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const asyncWrap=require("../public/utils/asyncWrap.js");
const ExpressError=require("../public/utils/expressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const  {isLoggedIn,isOwner}= require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage});

//    //VALIDATIONS FOR LISTINGS (SERVER SIDE)  //NOT WORKING
//    const validateListing = (req,res,next) =>{  //validating schema (to fill every value using server side like hopscotch,postman) using joi //server side error
//     let {error} =listingSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",")
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
//    };


router.route("/")
       .get(asyncWrap(  listingController.index  ))
     
       .post(/*validateListing,*/isLoggedIn,upload.single('image'),asyncWrap( listingController.postingList//passing validateListing method as middleware

        //   let result= listingSchema.validate(req.body);  //schema errors (validation errors) using joi//solving server-side error.that means on filling values on server side like on hopscotch and postman etc
        //   if(result.error) {
        //    throw new ExpressError(400,result.error);       }
         ));  

//CREATE LIST
router.get("/new",isLoggedIn,listingController.createListing);


router.route("/:id")
            .get(asyncWrap(listingController.showListing))
            .put(isLoggedIn,isOwner,upload.single('listing[image]'),asyncWrap(listingController.updateListing));
    
  
// //INDEX ROUTE

//   router.get("/",asyncWrap(  listingController.index  ));      //here no need to worry because "/" in router = "/listings" in app.js  .because we import this with name lisating and we use a middleware app.use("/listings",listings)


//POSTING LIST
  // router.post("/",/*validateListing,*/asyncWrap( listingController.postingList//passing validateListing method as middleware

  //   //   let result= listingSchema.validate(req.body);  //schema errors (validation errors) using joi//solving server-side error.that means on filling values on server side like on hopscotch and postman etc
  //   //   if(result.error) {
  //   //    throw new ExpressError(400,result.error);       }
  //    ));    

// //SHOW LISTINGS
// router.get("/:id",asyncWrap(listingController.showListing));

//EDIT LISTINGS
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.editListing));

// //SUBMITTING EDITED DATA OF LISTING
// router.put("/:id",isLoggedIn,isOwner,asyncWrap(listingController.updateListing));


//DELETE LISTING
router.get("/:id/delete",isLoggedIn,isOwner,listingController.deleteListing);

module.exports=router;