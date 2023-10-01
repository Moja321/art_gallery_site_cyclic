const express = require("express");
const router= express.Router();
const bcrypt = require("bcrypt");
const user = require("../models/user_model.js");

router.get("/new", (req,res)=>{
    res.render("sessions/new.ejs");
});

router.post("/",(req,res)=>{
    user.findOne({username: req.body.username}, (err,foundUser)=>{
        if (err) {
            console.log(err);
            //res.send("Invalid user name or password");
        }else{
            //if(req.body.password === foundUser.password){
            //Compare the encrypted values
            if(foundUser != null){
                if(bcrypt.compareSync(req.body.password, foundUser.password)){
                    req.session.currentUser = foundUser;
                    res.redirect("/");
                    //res.send("Logged in");
                }
            }else{
                res.send("Invalid user name or password");
            }
        }

    });
});

router.delete("/", (req,res)=>{
    console.log("Deleting session");
    req.session.destroy(()=>{
        console.log("Session deleted");
        res.redirect("/");
    });
});

module.exports = router;