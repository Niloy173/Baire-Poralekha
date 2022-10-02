const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const { BannerModel } = require("../../model/BannerSchema");

async function PostBanner(req, res, next) {
  try {
    const BannerInfo = {};

    const path_of_bannerImage = path.join(
      __dirname + "/../" + "/../public/banner/"
    );

    if (req.originalUrl.split("/").reverse()[0] != "create-banner") {
      const updateInformation = await BannerModel.updateOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          $set: {
            description: req.body.description ? req.body.description : " ",
            link: req.body.link ? req.body.link : " ",
          },
        },
        { new: true, useFindAndModify: false },
        function (err, data) {
          if (!err) {
            if (req.file) {
              fs.unlink(
                path.join(path_of_bannerImage, req.file.filename),
                (err) => {
                  if (!err) {
                    // nothing to do here
                  }
                }
              );
            }

            res.redirect("/admin/dashboard");
            // res.redirect(`/admin/articles/${req.params.id}/preview-article`);
          }
        }
      ).clone();
    } else {
      BannerInfo.banner = {
        data: fs.readFileSync(
          path.join(path_of_bannerImage, req.file.filename)
        ),
        contentType: path.extname(req.file.filename).replace(".", ""),
        filename: req.file.filename,
      };

      BannerInfo.description = req.body.description
        ? req.body.description
        : " ";

      BannerInfo.link = req.body.link ? req.body.link : " ";

      BannerInfo.date =
        String(new Date().getDate()).padStart(2, "0") +
        "/" +
        String(new Date().getMonth() + 1).padStart(2, "0") +
        String(new Date().getFullYear());

      const Banner = new BannerModel().CreateBanner(BannerInfo);

      fs.unlink(path.join(path_of_bannerImage, req.file.filename), (err) => {
        if (err) {
          console.log(err);
        }
      });

      Banner.save();

      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

module.exports = {
  PostBanner,
};
