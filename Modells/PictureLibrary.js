const mongoose = require("mongoose");
const { Schema } = mongoose;

const PictureSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "newusers",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  tags: [String], // Changed to an array of strings
  postTime: {
    type: Date,
    default: Date.now,
  },
  postEditTime: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "comments",
    },
  ],
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "likes",
    },
  ],
  imageLink: {
    type: String,
    required: true,
  },
});

// Create and export the Mongoose model
let Picture;

if (mongoose.models.picture) {
  Picture = mongoose.model("picture");
} else {
  Picture = mongoose.model("picture", PictureSchema);
}

// Define the Mongoose schema for UseredFen
const PictureLibrarySchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "newusers",
  },
  description: {
    type: String,
    required: false,
  },
  tags: [String], // Changed to an array of strings
  postTime: {
    type: Date,
    default: Date.now,
  },
  postEditTime: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "comments",
    },
  ],
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "likes",
    },
  ],
  pictures: [
    {
      type: mongoose.Types.ObjectId,
      ref: "pictures",
    },
  ],
  isDefault: {
    type: Boolean,
    default: false,
  },
});

// Create and export the Mongoose model
let PictureLibrary;

if (mongoose.models.picturelibrary) {
  PictureLibrary = mongoose.model("picturelibrary");
} else {
  PictureLibrary = mongoose.model("picturelibrary", PictureLibrarySchema);
}

exports.modules = [
  Picture,
  PictureSchema,
  PictureLibrary,
  PictureLibrarySchema,
];
