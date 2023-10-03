const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const methodOverride = require("method-override");

const Artwork = require("./models/artworks");

const app = express();
require("dotenv").config();
app.use(cors());

const PORT = process.env.PORT || 3000;
const mongoURI = `mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DB_NAME}`;

//Establish connection with mongodb
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(mongoURI,{useNewURLParser:true});
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
}

// mongoose.connect(mongoURI,{useNewURLParser:true});
// const db = mongoose.connection;
// db.on("connected",()=>{
//     console.log("Succesfully connected to MongoDB: " + process.env.MONGO_DB_NAME);
// })
// db.on("disconnected",()=>{
//     console.log("Succesfully disconnected to MongoDB: " + process.env.MONGO_DB_NAME);
// })
// db.on("error",(err)=>{
//     console.log("Error while connectiong to MongoDB: " + err.message);
// })

app.use(express.static("public"));
app.set("view engine", "ejs");

//secret is a random key which is used to authenticate your session,
//if not time limit is set, the cookie is deleted when the browser is closed
//resave causes the cookie to resave everytime user interacts with the site (can prolong session)
app.use(session({secret:"somerandomstring", resave: false, saveUninitialized: false}));

app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:false}));

const userController = require("./controllers/user_controller.js");
const sessionController = require("./controllers/session_controller.js");
const artworksController = require("./controllers/artworks_controller");

app.use("/users", userController);
app.use("/sessions", sessionController);
app.use("/artworks", artworksController);

// app.get("/", (req,res)=>{
//     res.render("index.ejs",{currentUser: req.session.currentUser});
//     //res.render("./artworks/index.ejs");
// });

app.get("/", (req, res) => {
    Artwork.find({}, (err, artworks) => {
      if (err) {
        console.log(err);
      }
      res.render("./artworks/index.ejs", { artworks : artworks, currentUser: req.session.currentUser});
    });
});

app.get("/userpage", (req, res) => {
    Artwork.find({}, (err, artworks) => {
      if (err) {
        console.log(err);
      }
      res.render("./artworks/userpage.ejs", { artworks : artworks, currentUser: req.session.currentUser});
    });
});

// app.get("/party",(req,res)=>{
//     if(req.session.currentUser){
//         //res.send("Party Time!");
//         res.redirect("/artworks");
//     }else{
//         res.redirect("/sessions/new");
//     }
// })

app.get("/party",(req,res)=>{
    if(req.session.currentUser){
        res.send("Party Time!");
        //res.redirect("/");
    }else{
        res.redirect("/sessions/new");
    }
})

//Listen to port

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})

// app.listen(PORT, () => {
//     console.log("App is listening on port " + PORT);
// });


