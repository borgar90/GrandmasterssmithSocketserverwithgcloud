/**
 * @description Filter for filtyper som er tillatt å laste opp til serveren
 * @author Borgar Flaen Stensrud
 */

const fileFilter = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|bmp|tiff|webp/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};
exports.module = fileFilter;
