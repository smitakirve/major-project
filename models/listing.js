const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const Review=require("./review")

const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{ 
        url: {
            type:String,
        default:"https://images.unsplash.com/photo-1717968367644-d1df1151758a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8",
        set:(v)=>v ===""
        ? "https://images.unsplash.com/photo-1717968367644-d1df1151758a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8"
        :v,
        },
         image: String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async (listing) =>{
    if (listing){
    await Review.deleteMany({_id:{$in: listing.reviews}}) 
    }
})
const Listing= mongoose.model("Listing", listingSchema);

module.exports=Listing;
