
const Listing=require("../models/listing.js");



module.exports.index=async(req,res)=>{           //here no need to worry because "/" in router = "/listings" in app.js  .because we import this with name lisating and we use a middleware app.use("/listings",listings)

    const allListings = await Listing.find({});
       res.render("listings/index.ejs",{allListings})
   }

module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
  
    const list=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");  //populate is used to print reviews because their id is stored in listings
    if(!list){
       req.flash("error","Listing you requested does not exist");
       res.redirect("/listings");
    }
   
    res.render("listings/show.ejs",{list});
 }

 module.exports.createListing=(req,res)=>{
   
    res.render("listings/new.ejs");
}

module.exports.postingList=async(req,res)=>{ 
   
let url=req.file.path;
let filename=req.file.filename;

const {title,description,price,location,country}=req.body;
 
let newListing=new Listing({
 title:title,
 description:description,
 price:price,
 location:location,
 country:country
});



newListing.owner=req.user._id;
newListing.image={
   url,filename
}
await newListing.save();
req.flash("success","New Listing Created!")
res.redirect("/listings");
}

module.exports.editListing=async (req,res)=>{
    const {id}=req.params;
    const list=await Listing.findById(id);
    
    let originalImageUrl=list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_100");
    res.render("listings/edit.ejs",{list,originalImageUrl});
 }

 module.exports.updateListing=async(req,res)=>{
    if (!req.body.listing) {
        throw new ExpressErrorp(400,"send valid data for listing")
       }
    const {id}=req.params;

    let  list=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){   // if new file is uploaded 
    let url=req.file.path;
    let filename=req.file.filename;
    list.image={url,filename}
    await list.save();
   }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
 }

 module.exports.deleteListing=async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete({_id:id}).then(res=>{
        console.log("deleted");
      });
     req.flash("deletion","Listing Deleted!");
      res.redirect("/listings");
 
 }