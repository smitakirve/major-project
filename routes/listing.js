const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner} =require("../middleware.js");

const multer=require("multer");
const upload=multer({dest:"uploads/"})

const validateListing=(req,res,next)=>{
    let {error }=listingSchema.validate(req.body);
    // console.log(result);
    if (error){
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
};
const listingController = require("../controller/listings.js")
// index
router.get("/",wrapAsync(listingController.index)
);
// new
router.get("/new",isLoggedIn,(listingController.new));

// show route
router.get("/:id", wrapAsync(listingController.show));

// create route
router.post("/", 
    validateListing,
    wrapAsync(listingController.create) );

// router.post(upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// })

// edit
//Edit Route
router.get(
    "/:id/edit",
    // isLoggedIn,
    // isOwner,
    wrapAsync,(listingController.edit));

// update
router.put("/:id",isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.update));

// delete
router.delete("/:id",
    isLoggedIn,
    isOwner,wrapAsync,(listingController.delete))

module.exports=router;