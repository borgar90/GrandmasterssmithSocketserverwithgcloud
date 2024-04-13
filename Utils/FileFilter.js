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
