//authentication

 const mongoose=require("mongoose");
 const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email : {
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose);  // this will add username and password and hashing by itself.no need to enter by user.only email will be sufficient

module.exports=mongoose.model("User",userSchema);