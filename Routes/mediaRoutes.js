const express = require("express");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const uploadFileToGCS = require("../Utils/UploadFileToGCS");
const { default: User } = require("../Modells/User");
const { sanitizeNameForUrl } = require("../Utils/SanitizeLibName");
const jwt = require("jsonwebtoken");
const PictureLibrary = require("../Modells/PictureLibrary");
const Picture = require("../Modells/PictureLibrary");

const router = express.Router();
const storage = multer.memoryStorage(); // Use memory storage

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|bmp|tiff|webp/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const imageUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit //TODO WAAAY TO BIG
  fileFilter: fileFilter,
});

const googleStorage = new Storage();
const bucketName = "grandmasters-smith";

router.get("/download/:username/:photolib/:photoname", async (req, res) => {
  const { username, photolib, photoname } = req.params;
  const filePath = `uploads/${username}/${photolib}/${photoname}.webp`;

  try {
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    // Generates a signed URL for the file
    const [url] = await googleStorage
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);

    // Send the signed URL to the client
    return res.status(200).send({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res
      .status(500)
      .send({ message: "Error generating signed URL", error: error });
  }
});

router.get("/download/profile_photo", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  let userID;
  jwt.verify(token.value, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }

    // User is authenticated, you can access decoded information
    userID = decoded.user.id; // Assign user information to the socket
    next();
  });
  let user;
  let profilePhoto;
  let filePath;
  try {
    user = User.findById(userID).populate("profilePicture");
    profilePhoto = user.profilePicture.imageLink;
    filePath = `uploads/${profilePhoto}`;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).send({ message: "Error finding User", error: error });
  }
  try {
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    // Generates a signed URL for the file
    const [url] = await googleStorage
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);

    // Send the signed URL to the client
    return res.status(200).send({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res
      .status(500)
      .send({ message: "Error generating signed URL", error: error });
  }
});

router.post(
  "/upload/images",
  imageUpload.array("images", 10),
  async (req, res, next) => {
    let { lib, photos } = req.body;
    console.log(typeof photos, photos);
    photos = photos ? JSON.parse(photos) : [];
    photos =
      photos.length > 0
        ? photos.map((photo) => ({
            ...photo,
            name: sanitizeNameForUrl(
              photo.name || `default-photo-name-${Date.now()}`
            ),
          }))
        : [];
    console.log("cookies: ", req.cookies);

    const token = req.cookies.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }
    let userID;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }

      // User is authenticated, you can access decoded information
      userID = decoded.user.id; // Assign user information to the socket
      next();
    });
    let user;
    try {
      user = User.findById(userID);
    } catch (error) {
      console.error("Error generating signed URL:", error);
      res.status(500).send({ message: "Error finding User", error: error });
    }

    const username = user.username;
    if (!username)
      return res.status(500).send({ message: "Error finding User" });

    let library;
    if (lib?.id) {
      library = await PictureLibrary.findById(lib.id);
      if (!library) {
        return res.status(500).send({ message: "Error finding Library" });
      }
    } else {
      library = await getDefaultLibrary(user._id, res);
    }

    // Last opp hvert bilde til Google Cloud Storage
    req.files.forEach(async (file, index) => {
      if (!photos[index]) {
        photos[index].name = `photo-${index}`;
      }
      const newFilename = `${Date.now()}-${index}-${photos[index].name}`;
      const photoPath = `${username}/${libname}/${newFilename}`;
      const destination = `uploads/${photoPath}`;

      try {
        const photo = await Picture.create({
          user: userID,
          imageLink: photoPath,
          description: "",
          tags: [],
        });
        library.pictures.push(photo._id);
        library.save();
      } catch (error) {
        console.error("Error uploading image to database:", error);
        res
          .status(500)
          .send({ message: "Error uploading image to database", error: error });
      }
      try {
        await uploadFileToGCS(file.buffer, destination);
      } catch (error) {
        console.error("Error uploading image:", error);
        res
          .status(500)
          .send({ message: "Error uploading image", error: error });
      }
    });

    res.send({ message: "Images uploaded successfully" });
  }
);

async function getDefaultLibrary(userId, res) {
  // Check if the user already has a default library
  let defaultLibrary = await PictureLibrary.findOne({
    user: userId,
    isDefault: true,
  });
  if (!defaultLibrary) {
    // Create a new default library if it does not exist
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(500)
        .send({ message: "Error finding User for adding default photo lib" });

    defaultLibrary = await PictureLibrary.create({
      name: "My Photos",
      user: userId,
      isDefault: true,
      pictures: [],
    });
    if (!defaultLibrary) {
      throw new Error("Error creating default library");
    }
  }
  return defaultLibrary;
}

module.exports = router;
