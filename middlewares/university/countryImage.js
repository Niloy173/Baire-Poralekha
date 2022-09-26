const { ImageUploader } = require("../../helpers/fileupload");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");
const { CountryModel } = require("../../model/CountrySchma");

const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

function attachmentUpload(req, res, next) {
  const pathname = path.join(__dirname + "/../" + "/../public/countryimage/");

  new ImageUploader(pathname, 5 * 1024 * 1024, [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ]).upload.single("avatar")(req, res, (err) => {
    if (err) {
      res.render("error", {
        message: err.message,
        status: 404,
      });
    } else {
      const UpdatedroutePath = req.originalUrl.split("/").reverse()[0];

      if (UpdatedroutePath === "countrydata-update") {
        // This is where admins trying to
        // check if already created university
        // havinfg any change with the file upload

        const currentCountryId = req.originalUrl.split("/").reverse()[1];

        if (req.file) {
          const ext_name = path.extname(req.file.filename);
          CountryModel.updateOne(
            { _id: mongoose.Types.ObjectId(currentCountryId) },
            {
              $set: {
                countryImage: {
                  data: fs.readFileSync(
                    path.join(
                      __dirname +
                        "/../" +
                        "/../public/countryimage/" +
                        req.file.filename
                    )
                  ),
                  contentType: ext_name.replace(".", ""),
                  filename: req.file.filename,
                },

                countryName: req.body.countryname.trim(),
                countryDetails: req.body.countryDetails.trim(),
              },
            },
            { new: true, useFindAndModify: false },

            function (err, data) {
              if (!err) {
                // image uploaded
                // console.log("Image uploaded");

                fs.unlink(path.join(pathname, req.file.filename), (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.redirect(`/admin/countries`);
                  }
                });
              }
            }
          );
        } else {
          CountryModel.updateOne(
            {
              _id: mongoose.Types.ObjectId(currentCountryId),
            },
            {
              $set: {
                countryName: req.body.countryname.trim(),
                countryDetails: req.body.countryDetails.trim(),
              },
            },
            {
              new: true,
              useFindAndModify: false,
            },
            function (err, data) {
              if (!err) {
                res.redirect("/admin/countries");
              }
            }
          );
        }
      } else {
        // For the University Creation

        const ext_name = path.extname(req.file.filename);
        if (req.file === undefined) {
          res.render("Forms/countrySelection", {
            message: "please select an image",
          });
        }
        universityVerificationModel.updateOne(
          { OwnerId: req.user.userid },
          {
            $set: {
              countryImage: {
                data: fs.readFileSync(
                  path.join(
                    __dirname +
                      "/../" +
                      "/../public/countryimage/" +
                      req.file.filename
                  )
                ),
                contentType: ext_name.replace(".", ""),
                filename: req.file.filename,
              },

              countryName: req.body.countryname.trim(),
              countryDetails: req.body.countryDetails.trim(),
            },
          },
          { new: true, useFindAndModify: false },

          function (err, data) {
            if (!err) {
              // image uploaded
              // console.log("Image uploaded");
              // setTimeout(() => {
              //   res.redirect("/admin/universityform");
              // }, 1000);

              res.redirect("/admin/universityform");
            }
          }
        );
      }
    }
  });
}

module.exports = {
  attachmentUpload,
};
