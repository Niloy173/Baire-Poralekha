const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors");

class ImageUploader {
  constructor(pathname, size, extension) {
    this.pathname = pathname; // upload folder
    this.size = size; // size for each file
    this.extension = extension; // .pdf .jpg .png
  }

  check() {
    fs.readdir(this.pathname, (err, files) => {
      for (const file of files) {
        fs.unlink(path.join(this.pathname, file), (err) => {
          if (err) createError("File Error");
        });
      }
    });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      this.check(), cb(null, this.pathname);
    },

    filename: (req, file, cb) => {
      let file_ext = path.extname(file.originalname);
      let filename =
        file.originalname
          .replace(file_ext, "")
          .split(" ")
          .join("")
          .toLowerCase() +
        "-" +
        Date.now() +
        file_ext;

      cb(null, filename);
    },
  });

  upload = multer({
    storage: this.storage,
    limits: {
      fileSize: this.size,
    },
    fileFilter: (req, file, cb) => {
      if (this.extension.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("extension error! file format not supported"));
      }
    },
  });
}

module.exports = {
  ImageUploader,
};
