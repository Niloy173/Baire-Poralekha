const { ImageUploader } = require("../../helpers/fileupload");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");

const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

function university_attachmentUpload(req, res, next) {
  const pathname = path.join(
    __dirname + "/../" + "/../public/universityimage/"
  );

  new ImageUploader(pathname, 2 * 1024 * 1024, [
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

      if (UpdatedroutePath === "universitydata-update") {
        const currentUniversityId = req.originalUrl.split("/").reverse()[1];

        if (req.file) {
          const ext_name = path.extname(req.file.filename);
          UniversityModel.updateOne(
            { _id: mongoose.Types.ObjectId(currentUniversityId) },
            {
              $set: {
                universityCover: {
                  data: fs.readFileSync(
                    path.join(
                      __dirname +
                        "/../" +
                        "/../public/universityimage/" +
                        req.file.filename
                    )
                  ),
                  contentType: ext_name.replace(".", ""),
                  filename: req.file.filename,
                },
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

                fs.unlink(path.join(pathname, req.file.filename), (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    next();
                  }
                });
              }
            }
          );
        } else {
          next();
        }
      } else {
        const ext_name = path.extname(req.file.filename);
        if (req.file === undefined) {
          res.render("Forms/universityForm", {
            error: [
              {
                msg: "please select an image",
              },
            ],
          });
        }
        universityVerificationModel.updateOne(
          { OwnerId: req.user.userid },
          {
            $set: {
              universityCover: {
                data: fs.readFileSync(
                  path.join(
                    __dirname +
                      "/../" +
                      "/../public/universityimage/" +
                      req.file.filename
                  )
                ),
                contentType: ext_name.replace(".", ""),
                filename: req.file.filename,
              },
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

              next();
            }
          }
        );
      }
    }
  });
}

module.exports = {
  university_attachmentUpload,
};
