if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
    
}


const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const path= require("path");
const methodOverride =require("method-override");
const wrapAsync=require("./utils/wrapAsync.js");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter=require("./routes/review .js");
const userRouter=require("./routes/user.js");

const session =require("express-session");
const flash=require("connect-flash");

main().then(()=>{
    console.log("connect")
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
};
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))

const sessionOptions={
    secret:"supersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60 *1000,
        httpOnly:true,
    }
};

app.get("/",(req,res)=>{
    res.send("hii ")
}); 

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser= req.user;
    // console.log(res.locals.success);
    next();
});


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser= await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

// const validateListing=(req,res,next)=>{
//     let (error )=listingSchema.validate(req.body);
//     // console.log(result);
//     if (error){
//         throw new ExpressError(400,result.error);
//     }else{
//         next();
//     }
// }


// const validateReview=function (req, res, next) {
//     let { error } = reviewSchema.validate(req.body); ///it is for joi schema validation///
  
//     if (error) {
//       throw new ExpressError(400, error.details[0].message);
//     } else {
//       next();
//     }
//   };
  
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// app.get("/test",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:7900,
//         location:"goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("successful");
// });
app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="something wrong"}=err;
    res.status(status).render("error.ejs",{message});

    // res.status(status).send(message);
})
app.listen(8080,()=>{
    console.log("server is listening")
});


// working noww ...