const Listing=require("../models/listing");


module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({})
        res.render("listings/index.ejs",{allListings});

}

module.exports.new =async(req,res)=>{
    
        if(!req.isAuthenticated()){
            req.flash("error","you must be logged in to create listing")
            return res.redirect("/login");
        }
        res.render("listings/new.ejs")
    }


module.exports.show =async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate
    ({path: "reviews", 
    populate:{
        path:"author"
    }
    })
    .populate("owner");
    if(!listing){
        req.flash("error"," Listing you requested for does not exist!")  
        res.redirect("/listings")
    }
     console.log(listing);
    res.render("listings/show.ejs",{listing})
}

module.exports.create=async(req,res,next)=>{
    // console.log("REQ RECEIVED")
    // let{title,description,image,price,location,country}=req.body;
    // let listing= req.body.listing;
    req.body.listing.image = {
        url: req.body.listing.image,
        filename: "listingimage"
    }
    let result = listingSchema.validate(req.body);
    const newListing=new Listing(req.body.listing)  
    newListing.owner=req.user._id;
    await newListing.save();
    // console.log(listing);
    req.flash("success","New Listing Create")
    res.redirect("/listings");
    
}

module.exports.edit=async (req, res) => {
    let { id } = req.params; 
     console.log("editing")
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", " Listing you requested for does not exit!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }

module.exports.update=async(req,res)=>{
    let {id}=req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner.equals(res.locals.currUser._id)){
    //     req.flash("error","you dont have permissionto edit")
    //     return res.redirect(`/listings/${id}`);
    // }
    req.body.listing.image = {
        url: req.body.listing.image,
        filename: "listingimage"
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.delete=async(req,res)=>{
    let {id}=req.params;
   console.log("deleting")
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    res.redirect("/listings");
}