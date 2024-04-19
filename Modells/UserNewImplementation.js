const { EloRatingSchema } = require("./eloRatingSchema");
const mongoose = require("mongoose");
const { Schema, Model } = mongoose;

// Create and export the Mongoose model
let EloRating;

if (mongoose.models.eloratings) {
  EloRating = mongoose.model("eloratings");
} else {
  EloRating = mongoose.model("eloratings", EloRatingSchema);
}

// Define the Mongoose schema for UseredFen
const NewUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  auth0id: {
    type: String,
    required: true,
    unique: true,
  },
  elo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "eloratings",
  },

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newusers",
      required: true,
      default: [],
    },
  ],
  profilePicture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "picture",
    required: false,
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Roles" },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teams" }],
});
// Ensure to populate role and team when querying users

// Create and export the Mongoose model

const User = mongoose.model("users", NewUserSchema);

const getUser = async (id) => {
  try {
    const user = await User.findOne({ auth0id: id });
    if (!user) return {};
    return user;
  } catch (err) {
    console.error(err);
    return {};
  }
};

module.exports = { User, getUser };
