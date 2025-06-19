const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");

 
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended :true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch(()=>{
    console.log("error")
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hii. i am root");
});

app.get("/listings", async(req,res)=>{
   const allListings= await Listing.find({});
    res.render("listings/index",{allListings});
});

app.get("/listings/new", async(req,res)=>{
    res.render("listings/new.ejs");
});

//post route
app.post("/listings", async(req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//show route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show", {listing});
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit", { listing });
});

app.put("/listings/:id", async(req,res)=>{
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id/", async(req,res)=>{
     let {id} = req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
});





// app.get("/testListing",async(req,res)=>{
//     let sampleListing= new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"india",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });



app.listen(8080,()=>{
    console.log("app listening on port 8080");
});