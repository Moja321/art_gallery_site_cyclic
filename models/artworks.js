//___________________
//Dependencies
//___________________
const mongoose          = require ( 'mongoose' );
const Schema            = mongoose.Schema;

//___________________
//Set up Schema
//___________________
const artworkSchema     = new Schema ({
  title        : {
      type    : String,
      required: [true, 'No one will buy it if it does not have a name']
  },
  description : String,
  img         : String,
  likes       : {
          type: Number,
          min : [0, 'Quantity can\'t be less than 0. No capatalist joyrides here!']
  },
  userId      : {
          type: String,
  },
  userName    : {
          type:String,
  }
});

// const artworkSchema     = new Schema ({
//         name        : {
//             type    : String,
//             required: [true, 'No one will buy it if it does not have a name']
//         },
//         description : String,
//         img         : String,
//         price       : {
//                 type: Number,
//                 min :[ 0, 'Price can\'t be less than 0. This ain\'t no charity!']
//         },
//         likes         : {
//                 type: Number,
//                 min : [0, 'Quantity can\'t be less than 0. No capatalist joyrides here!']
//         },
//         userId     : {
//                 type: String,
//         }
// });

//___________________
//Set up Model
//___________________
const Artwork          = mongoose.model('Artwork', artworkSchema );

//___________________
////Module Exports - access Artwork in controllers/artwork.js
//___________________
module.exports       = Artwork;
