const User=require("../models/user.js");

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs")
 }

module.exports.signupPost=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerUser=await User.register(newUser,password);
    req.login(registerUser,(err)=>{ // login method automatically makes the user logged in after signup
        if(err){
            next(err);
        }
        req.flash("success","Welcome eto wanderLust!");
        res.redirect("/listings");
    })
}
    catch(e){
        req.flash("error","a user with the given username already registered");
        res.redirect("/signup");
    }
}

module.exports.login=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginPost=async(req,res)=>{
    req.flash("success","Welcome to WanderLust.You are logged in")
   let redirectURL=res.locals.redirectURL||"/listings"
   console.log(res.locals.redirectURL)
   res.redirect(redirectURL);
  
          
}

module.exports.logout=(req,res)=>{
    req.logout((err)=>{  // req.logout is a method in passport used to logout a user
        if(err){
            next(err);
        }
        req.flash("success","you are logged out now")
        res.redirect("/listings");
    })
}