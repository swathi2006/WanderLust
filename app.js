if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}
console.log(process.env.CLOUD_NAME)

const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const port=1414;
const path=require("path");
const methodOverride=require("method-override");
const asyncWrap=require("./public/utils/asyncWrap.js");
const ExpressError=require("./public/utils/expressError.js");
// const {listingSchema,reviewSchema}=require("./schema.js");  // these are not required to app.js 
// const Review = require("./models/review.js");
const listingrouter=require("./routes/listing.js");
const reviewrouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport")
const LocalStrategy=require("passport-local"); 
const User=require("./models/user.js");
const userrouter=require("./routes/user.js");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));//to use public folder files
app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));



 // CREATING AND CONNECTION TO DATABASE 
main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err);
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
    // await mongoose.connect(process.env.ATLASDB_URL)
}




const store=MongoStore.create({
    mongoUrl : "mongodb://127.0.0.1:27017/wanderLust",  // all information stored in this url (mongodbatlas)
    crypto: {  // to store sensitive information we use encryption
        secret: process.env.SECRET,
    },
    touchAfter : 24*3600, // session update
});

store.on("error", ()=>{
    console.log("error in mongo session store", err);
});

const sessionOptions = {
    store, // store=store
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // initializing passport
app.use(passport.session());  // using this, the server does not ask authentication for every request in single session
passport.use(new LocalStrategy(User.authenticate())); // using local strategy and authenticate generates  a function that is used in localstartegy

passport.serializeUser(User.serializeUser()); // this generates a functionn used by passport  that stores the user in session store
passport.deserializeUser(User.deserializeUser()); //// this generates a functionn used by passport  that remove the user from session store

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.deletion=req.flash("deletion");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
        
//     });
//    let registerUser= await User.register(fakeUser,"helloworld");  // register method saves fakeuser in db with this password(helloworld)
//    res.send(registerUser);

// });
app.use("/listings",listingrouter);  // wherever /listings is used ,listing.js is triggered
app.use("/listings/:id/reviews",reviewrouter); 
app.use("/",userrouter);




//MIDDLEWARE IF NO ROUTES MATCHED ABOVE ROUTES ENTERED BY USER IN SERVER SIDE
app.all("*",(req,res,next)=>{  //this response will be send to all routes //if a given route is not matched with above routes then this will be printed
   next(new ExpressError(404,"page not found"))
});

// MIDDLEWARE OF ANY ERROR
// app.use((err,req,res,next)=>{
//     let {statuscode=500,message="something went wrong"}=err;
//     res.status(statuscode).render("listings/error.ejs",{err})
// })

app.listen(1414,()=>{
    console.log("listening to port 1414");
});

