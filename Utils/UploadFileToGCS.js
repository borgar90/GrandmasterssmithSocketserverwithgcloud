const { Storage } = require("@google-cloud/storage");
const googleStorage = new Storage();
const bucketName = "grandmasters-smith";

const uploadFileToGCS = async (fileBuffer, destination) => {
  const bucket = googleStorage.bucket(bucketName);
  const file = bucket.file(destination);
  const stream = file.createWriteStream({
    metadata: {
      contentType: "auto", // Auto-detect the file type
    },
  });

  stream.on("error", (err) => console.error(err));
  stream.on("finish", async () => {
    // The file upload is complete
    console.log(`File uploaded to ${destination}`);
  });

  stream.end(fileBuffer);
};

exports.uploadFileToGCS = uploadFileToGCS;
