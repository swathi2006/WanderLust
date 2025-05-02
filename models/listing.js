const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema=new schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
      url:String,
      filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:
        {
            type:schema.Types.ObjectId,
            ref:"User",
        },
    // category:   // using this option we can filter listings according to category and make filters bar works in backend
    // {
    //     type:String,
    //     enum:["mountains","arctic","farms"] // any category 
    // }
    

    

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
   await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;