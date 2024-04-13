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
  password: {
    type: String,
    required: true,
  },
  elo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "eloratings",
  },
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  emailVerified: { type: Boolean, default: false },
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
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
});
// Ensure to populate role and team when querying users
NewUserSchema.pre("findOne", function (next) {
  this.populate("role").populate("team");
  next();
});
NewUserSchema.pre("find", function (next) {
  this.populate("role").populate("team");
  next();
});
// Create and export the Mongoose model
let User;

if (mongoose.models.newusers) {
  User = mongoose.model("newusers"); //TODO TO BE RENAMED users BEFOR PRODUCTION
} else {
  User = mongoose.model("newusers", NewUserSchema);
}

exports.modules = User;
