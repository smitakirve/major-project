const express =require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const { isLoggedIn ,isReviewAuthor} = require("../middleware.js");

const validateReview=function (req, res, next) {
    let { error } = reviewSchema.validate(req.body); ///it is for joi schema validation///
  
    if (error) {
      throw new ExpressError(400, error.details[0].message);
    } else {
      next();
    }
  };

 const reviewController = require("../controller/reviews.js") 
// reviews
router.post("/",isLoggedIn,validateReview
  ,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview))

module.exports= router;