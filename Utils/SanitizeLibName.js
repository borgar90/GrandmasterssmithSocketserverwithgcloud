const sanitizeNameForUrl = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, ""); // Remove non-alphanumeric or non-hyphen characters
};
exports.sanitizeNameForUrl = sanitizeNameForUrl;
