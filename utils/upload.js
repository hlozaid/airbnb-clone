const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDir = path.join(__dirname, "..", "public", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomBytes(12).toString("hex") + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
  },
});

// Local /uploads/... image delete helper (remote URLs ko haath nahi lagata)
const removeLocalImage = (image) => {
  if (image && image.url && image.url.startsWith("/uploads/")) {
    fs.unlink(path.join(uploadDir, path.basename(image.url)), () => {});
  }
};

module.exports = { upload, removeLocalImage };
