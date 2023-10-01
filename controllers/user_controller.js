const express = require("express");
const router= express.Router();
const bcrypt = require("bcrypt");

const user = require("../models/user_model.js");

router.get("/new", (req,res)=>{
    res.render("users/new.ejs");
});

router.post("/",(req,res)=>{
    const randomSaltSync = Math.floor(Math.random()*10) + 1;
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(randomSaltSync));
    user.create(req.body, (err,createdUser)=>{
        if (err) {
            console.log(err.message)
        }else{
            console.log("Created user: " + createdUser.username);
            req.session.currentUser = createdUser;
            res.redirect("/");
        }
    });
});

module.exports = router;