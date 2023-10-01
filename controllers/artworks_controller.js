//___________________
//Dependencies
//___________________
//require express so we can use router
const express = require("express");
const artworks = express.Router();

//___________________
//Models
//___________________
//get access to the Artwork model
const Artwork = require("../models/artworks");
const User = require("../models/user_model.js");

//___________________
//See json Route
//___________________
artworks.get("/json", (req, res) => {
  Artwork.find((err, artworks) => {
    res.send(artworks);
  });
});

//___________________
//7 Restful Routes
//___________________
// Index  : GET    '/artworks'          1/7
// Show   : GET    '/artworks/:id'      2/7
// New    : GET    '/prodcuts/new'      3/7
// Create : POST   '/artworks'          4/7
// Edit   : GET    '/artworks/:id/edit' 5/7
// Update : PUT    '/artworks/:id'      6/7
// Delete : DELETE '/artworks/:id'      7/7

// Index  : GET    '/artworks'          1/7
artworks.get("/", (req, res) => {
  Artwork.find({}, (err, artworks) => {
    if (err) {
      console.log(err);
    }
    res.render("./artworks/index.ejs", { artworks : artworks});
  });
});

// New    : GET    '/artworks/new'      3/7
// Order matters! must be above /prodcuts/:id or else this route will never get hit
artworks.get("/new", (req, res) => {
  res.render("./artworks/new.ejs", {currentUser: req.session.currentUser});
});

// Show   : GET    '/artworks/:id'      2/7
artworks.get("/:id", (req, res) => {
  Artwork.findById(req.params.id, (err, artwork) => {
    if (err) {
      console.log(err);
    }
    res.render("./artworks/show.ejs", { artwork: artwork, currentUser: req.session.currentUser });
  });//Product
});

// Create : POST   '/artworks'          4/7
artworks.post("/", (req, res) => {
  Artwork.create(req.body, (err, artwork) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/artworks/" + artwork.id);
    }
  });
});

// Edit   : GET    '/artworks/:id/edit' 5/7
artworks.get("/:id/edit", (req, res) => {
  Artwork.findById(req.params.id, (err, artwork) => {
    if (err) {
      console.log(err);
    }
    res.render("./artworks/edit.ejs", { artwork: artwork, currentUser : req.session.currentUser });
  });
});

//pass in id of item so that you can access the item's user page (gallery)
artworks.get("/:id/gallery", (req, res) => {
  Artwork.findById(req.params.id, (err, currentArtwork) => {
    if (err) {
      console.log(err);
    }
    Artwork.find({}, (err, artworks) => {
      if (err) {
        console.log(err);
      }
      res.render("./artworks/gallery.ejs", { currentArtwork:currentArtwork, artworks : artworks, currentUser: req.session.currentUser});
    });
    //res.render("./artworks/gallery.ejs", { artwork: artwork });
  });
});

// Update : PUT    '/artworks/:id'      6/7
artworks.put("/:id", (req, res) => {
  Artwork.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, artwork) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/artworks/" + artwork.id);
    }
  );
});

// Delete : DELETE '/artworks/:id'      7/7
artworks.delete("/:id", (req, res) => {
  Artwork.findByIdAndRemove(req.params.id, (err, artwork) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
    //res.redirect("/artworks");
    //res.render("./artworks/index.ejs", { artworks : artworks, currentUser: req.session.currentUser});
  });
});

//___________________
//Buy Route
//___________________

// artworks.put("/:id/buy", (req, res) => {
//   Artwork.findByIdAndUpdate(
//     req.params.id,
//     { $inc: { likes: -1 } },
//     (err, artwork) => {
//       if (err) {
//         console.log(err);
//       }
//       res.redirect("back");
//     }
//   );
// });

artworks.put("/:id/buy", (req, res) => {
  Artwork.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: +1 } },
    (err, artwork) => {
      if (err) {
        console.log(err);
      }
      //res.redirect("back");
      User.findByIdAndUpdate(
        req.session.currentUser._id,
        { $push:{ likedIds : req.params.id }},
        (err, user) => {
          if (err) {
            console.log(err);
          }
          res.redirect("back");
        }
      )
    }
  );
});

artworks.put("/:id/unlike", (req, res) => {
  Artwork.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: -1 } },
    (err, artwork) => {
      if (err) {
        console.log(err);
      }
      //res.redirect("back");
      User.findByIdAndUpdate(
        req.session.currentUser._id,
        { $pull:{ likedIds : req.params.id }},
        (err, user) => {
          if (err) {
            console.log(err);
          }
          res.redirect("back");
        }
      )
    }
  );
});

// artworks.put("/buy", (req, res) => {
//   Artwork.findByIdAndUpdate(
//     req.query.artworkid,
//     { $inc: { likes: +1 } }
//   ).then(()=>{User.findByIdAndUpdate(req.query.userid, { $push:{ likedIds:req.query.artworkid.toString() }}, 
//     (err, user)=>{
//       if (err) {
//         console.log(err);
//       }
//       res.redirect("back");
//     })
//   })
// });

// artworks.put("/:id/:userid/buy", (req, res) => {
//   Artwork.findByIdAndUpdate(
//     req.params.id,
//     { $inc: { likes: +1 } }
//   ).then(()=>{User.findByIdAndUpdate(req.params.userid, { $push:{ likedIds:req.params.id.toString() }}, 
//     (err, user)=>{
//       if (err) {
//         console.log(err);
//       }
//       res.redirect("back");
//     })
//   })
// });

//___________________
//Seed Route - Vist ONCE to populate database
//___________________
artworks.get("/seed/newartworks", (req, res) => {
  const newArtworks = [
    {
      _id: "58e913abb7304c0e0f20d0d8",
      name: "Beans",
      description:
        "A small pile of beans. Buy more beans for a big pile of beans.",
      img: "https://upload.wikimedia.org/wikipedia/commons/9/93/Phaseolus_vulgaris_white_beans%2C_witte_boon.jpg",
      price: 5,
      likes: 99,
      __v: 0,
    },
    {
      _id: "58e913abb7304c0e0f20d0da",
      name: "Beautiful Bins",
      description: "A stack of colorful bins for your beans and bones.",
      img: "http://www.clipartbest.com/cliparts/9cz/rMM/9czrMMBcE.jpeg",
      price: 7000,
      likes: 1,
      __v: 0,
    },
    {
      _id: "58e913abb7304c0e0f20d0d9",
      name: "Bones",
      description: "It's just a bag of bones.",
      img: "http://bluelips.com/prod_images_large/bones1.jpg",
      price: 25,
      likes: 0,
      __v: 0,
    },
    {
      _id: "58e9452e28ccf4146d4c485e",
      name: "Water Rose",
      img: "https://st2.depositphotos.com/1567988/11344/i/950/depositphotos_113449302-stock-photo-macro-photo-of-rose-with.jpg",
      description: "Beautiful, ephemeral, assembly required",
      likes: 5,
      __v: 0,
      price: 1000000,
    },
    {
      _id: "58e94d443931ca152bdd4478",
      name: "All Natural Organic Non-GM0 Pure 100% Natural Lime",
      img: "http://wallpaper-gallery.net/images/images/images-17.jpg",
      description:
        "Forget your fears of agricultural genetic engineering and take your taste buds back to the beginning of time with this authentic unaltered fruit",
      price: 17,
      likes: 72,
      __v: 0,
    },
    {
      _id: "58e956e73931ca152bdd4479",
      name: "Mantis Shrimp (tamed)",
      img: "http://otlibrary.com/wp-content/gallery/mantis-shrimp/mantis-shrimp.jpg",
      description:
        "Sustainably raised, cage-free, docile mantis shrimp. Makes a for a cuddly companion as long as you never make direct eye contact! Notice: this item is gluten-free, should your relationship go south",
      price: 887,
      likes: 0,
      __v: 0,
    },
    {
      _id: "58e958243931ca152bdd447a",
      name: "Kohlrabi",
      img: "http://canelasf.com/wp-content/uploads/2015/02/kohlrabi.jpg",
      description:
        "Get a jump on the next superfood craze. Kohlrabi's superiority is marked by its tricky to spell name. Text all your friends: You are going to live forever with the power of kholrabi",
      price: 6,
      likes: 913462,
      __v: 0,
    },
    {
      _id: "58e9893444738817298b3a3b",
      name: "Yogalates Fitness Machine 1000",
      img: "https://s-media-cache-ak0.pinimg.com/564x/a8/4f/05/a84f051bf47e41382e4becd4a3d05214.jpg",
      description:
        "Stop wasting your time doing one exercise at a time! With the YFM1000 you can do yoga and pilates at the same time! ",
      price: 3199,
      likes: 14,
      __v: 0,
    },
    {
      _id: "58eba62854241b05b274dc78",
      name: "Bell Jars",
      img: "https://s-media-cache-ak0.pinimg.com/736x/0a/6f/b6/0a6fb62caa11cfdb68c7c12a2620c012.jpg",
      description:
        "Capture the beauty of anything and don't let it get away! Formaldehyde sold separatey ",
      price: 49.99,
      likes: 49,
      __v: 0,
    },
    {
      _id: "58ed05dfa2b6901441a43419",
      name: "Portal to 5th Dimension",
      img: "https://images-assets.nasa.gov/image/PIA20912/PIA20912~thumb.jpg",
      description:
        "Bored of your neighborhood? Bored of your typical vacation? Go to the 5th dimension",
      price: 1,
      likes: 54,
      __v: 0,
    },
  ];

  Artwork.create(newArtworks, (err, artwork) => {
    if (err) {
      console.log(err);
    }
    console.log("SEED: NEW PRODUCTS CREATED!");
    res.redirect("/artworks");
  });
});

//___________________
//ALTERNATE Seed Route - Vist ONCE to populate database
//___________________
const artworkSeeds = require("../models/seed.js");
artworks.get("/seed/newartworks/viaseedfile", (req, res) => {
  Artwork.insertMany(artworkSeeds, (err, artworks) => {
    if (err) {
      console.log(err);
    } else {
      res.send(artworks);
    }
  });
});

//___________________
//Mistakes happen! Drop Database - Vist ONCE to drop your database. WARNING! YOU CANNOT UNDO THIS!
//___________________
artworks.get(
  "/dropdatabase/cannotundo/areyoursure/reallysure/okthen",
  (req, res) => {
    Artwork.collection.drop();
    res.send("You did it! You dropped the database!");
  }
);

//___________________
//Module Exports - access this file in server.js
//___________________
//Export router AND require it in server.js Step 3/3
//Note all three need to be working in order to get server runnning
module.exports = artworks;
