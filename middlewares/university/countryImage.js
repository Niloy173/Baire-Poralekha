const { ImageUploader } = require("../../helpers/fileupload");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");

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

        const currentUniversityId = req.originalUrl.split("/").reverse()[1];

        if (req.file) {
          const ext_name = path.extname(req.file.filename);
          UniversityModel.updateOne(
            { _id: mongoose.Types.ObjectId(currentUniversityId) },
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
                    res.redirect(
                      `/admin/all-university-dashboard/${currentUniversityId}/universitydata-update`
                    );
                  }
                });
              }
            }
          );
        } else {
          UniversityModel.updateOne(
            {
              _id: mongoose.Types.ObjectId(currentUniversityId),
            },
            {
              $set: {
                countryName: req.body.countryname.trim(),
              },
            },
            {
              new: true,
              useFindAndModify: false,
            },
            function (err, data) {
              if (!err) {
                setTimeout(() => {
                  res.redirect(
                    `/admin/all-university-dashboard/${currentUniversityId}/universitydata-update`
                  );
                }, 1000);
              }
            }
          );
        }
      } else {
        // For the University Creation

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
            },
          },
          { new: true, useFindAndModify: false },

          function (err, data) {
            if (!err) {
              // image uploaded
              // console.log("Image uploaded");
              setTimeout(() => {
                res.redirect("/admin/universityform");
              }, 1000);
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
