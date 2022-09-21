const { ImageUploader } = require("../../helpers/fileupload");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");

const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

function prospectus_attachmentUpload(req, res, next) {
  const pathname = path.join(__dirname + "/../" + "/../public/prospectus/");

  new ImageUploader(pathname, 5 * 1024 * 1024, [
    "application/pdf",
  ]).upload.single("avatar")(req, res, (err) => {
    if (err) {
      res.render("error", {
        message: err.message,
        status: 404,
      });
    } else {
      const UpdatedroutePath = req.originalUrl.split("/").reverse()[0];

      if (UpdatedroutePath === "prospectus-update") {
        const currentUniversityId = req.originalUrl.split("/").reverse()[1];

        if (req.file) {
          const ext_name = path.extname(req.file.filename);
          UniversityModel.updateOne(
            { _id: mongoose.Types.ObjectId(currentUniversityId) },
            {
              $set: {
                prospectus: {
                  data: fs.readFileSync(
                    path.join(
                      __dirname +
                        "/../" +
                        "/../public/prospectus/" +
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
        if (req.file === undefined) {
          res.render("Forms/prospectusInfo", {
            message: "please select an attachment",
          });
        }

        const ext_name = path.extname(req.file.filename);
        universityVerificationModel.updateOne(
          { OwnerId: req.user.userid },
          {
            $set: {
              prospectus: {
                data: fs.readFileSync(
                  path.join(
                    __dirname +
                      "/../" +
                      "/../public/prospectus/" +
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
  prospectus_attachmentUpload,
};
