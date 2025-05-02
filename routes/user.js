const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const asyncWrap=require("../public/utils/asyncWrap.js");
const ExpressError=require("../public/utils/expressError.js");
const passport=require("passport");
const  {isLoggedIn, saveRedirectURL}= require("../middleware.js");
const userController=require("../controllers/users.js");

router.route("/signup")
      .get(userController.signup)
      .post(asyncWrap(userController.signupPost));

// //signup route
// router.get("/signup",userController.signup);

// //signup info post route
// router.post("/signup",asyncWrap(userController.signupPost));

router.route("/login")
      .get(userController.login)
      .post(saveRedirectURL,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.loginPost);

// //login route
// router.get("/login",userController.login);

// //login info post route
// router.post("/login",saveRedirectURL,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.loginPost);

//logout route
router.get("/logout",userController.logout)
module.exports=router;