const { ImageUploader } = require("../../helpers/fileupload");
const { ArticleModel } = require("../../model/CreateArticleSchema");

const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");

function articleImageUpload(req, res, next) {
  const pathname = path.join(__dirname + "/../" + "/../public/articleimage/");

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
      // if (req.file === undefined) {
      //   res.render("admin/articlewriting", {
      //     message: "please upload an image",
      //   });
      // }

      if (
        req.file &&
        req.originalUrl.split("/").reverse()[0] != "create-article"
      ) {
        const updateImageArticle = await ArticleModel.updateOne(
          { _id: mongoose.Types.ObjectId(req.params.id) },
          {
            $set: {
              articleImage: {
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
  articleImageUpload,
};
