const { ImageUploader } = require("../../helpers/fileupload");
const { BannerModel } = require("../../model/BannerSchema");

const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");

function bannerUpload(req, res, next) {
  const pathname = path.join(__dirname + "/../" + "/../public/banner/");

  new ImageUploader(pathname, 5 * 1024 * 1024, [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]).upload.single("avatar")(req, res, async (err) => {
    if (err) {
      res.render("error", {
        message: err.message,
        status: 404,
      });
    } else {
      if (
        req.file &&
        req.originalUrl.split("/").reverse()[0] != "create-banner"
      ) {
        // update the banner
        const updateBanner = await BannerModel.updateOne(
          { _id: mongoose.Types.ObjectId(req.params.id) },
          {
            $set: {
              banner: {
                data: fs.readFileSync(path.join(pathname, req.file.filename)),
                contentType: path.extname(req.file.filename).replace(".", ""),
                filename: req.file.filename,
              },
            },
          },
          { new: true, useFindAndModify: false },
          function (err, data) {
            if (!err) {
              next();
            } else {
              console.log(err);
            }
          }
        ).clone();
      } else {
        next();
      }
    }
  });
}

module.exports = {
  bannerUpload,
};
