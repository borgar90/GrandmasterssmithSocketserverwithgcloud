const mongoose = require("mongoose");
const { Schema } = mongoose;

//TODO add user Object in user field.

// Define the Mongoose schema for EloRating
const EloRatingSchema = new Schema({
  rating: {
    type: Number,
    required: true,
  },
});

// Create and export the Mongoose model
let EloRating;

if (mongoose.models.eloratings) {
  EloRating = mongoose.model("eloratings");
} else {
  EloRating = mongoose.model("eloratings", EloRatingSchema);
}

exports.modules = [EloRating, EloRatingSchema];
