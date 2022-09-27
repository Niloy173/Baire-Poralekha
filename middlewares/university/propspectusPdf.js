const { ImageUploader } = require("../../helpers/fileupload");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");

const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

function prospectus_attachmentUpload_undergrad(req, res, next) {
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

      if (UpdatedroutePath === "undergraduation-prospectus-update") {
        const currentUniversityId = req.originalUrl.split("/").reverse()[1];

        UniversityModel.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(currentUniversityId) },
          {
            $push: {
              UnderGraduation: {
                deptname: req.body.department,
                pdf: {
                  data: fs.readFileSync(path.join(pathname, req.file.filename)),
                  contentType: path.extname(req.file.filename).replace(".", ""),
                  filename: req.file.filename,
                },
              },
            },
          },
          { new: true },

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
                  res.status(200).send("success");
                }
              });
            }
          }
        );
      } else {
        if (req.file === undefined) {
          res.status(500).json({
            errors: {
              filemissing: "file is missing",
            },
          });
        } else {
          universityVerificationModel.findOneAndUpdate(
            { OwnerId: mongoose.Types.ObjectId(req.user.userid) },
            {
              $push: {
                UnderGraduation: {
                  deptname: req.body.department,
                  pdf: {
                    data: fs.readFileSync(
                      path.join(pathname, req.file.filename)
                    ),
                    contentType: path
                      .extname(req.file.filename)
                      .replace(".", ""),
                    filename: req.file.filename,
                  },
                },
              },
            },
            { new: true },

            function (err, data) {
              if (!err) {
                res.status(200).json({
                  data,
                });
              }
            }
          );
        }
      }
    }
  });
}

function prospectus_attachmentUpload_grad(req, res, next) {
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

      if (UpdatedroutePath === "graduation-prospectus-update") {
        const currentUniversityId = req.originalUrl.split("/").reverse()[1];

        if (req.file) {
          UniversityModel.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(currentUniversityId) },
            {
              $push: {
                Graduation: {
                  deptname: req.body.department,
                  pdf: {
                    data: fs.readFileSync(
                      path.join(pathname, req.file.filename)
                    ),
                    contentType: path
                      .extname(req.file.filename)
                      .replace(".", ""),
                    filename: req.file.filename,
                  },
                },
              },
            },
            { new: true },
            function (err, data) {
              if (!err) {
                fs.unlink(path.join(pathname, req.file.filename), (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.status(200).send("success");
                  }
                });
              }
            }
          );
        }
      } else {
        if (req.file === undefined) {
          res.status(500).json({
            errors: {
              filemissing: "file is missing",
            },
          });
        } else {
          universityVerificationModel.findOneAndUpdate(
            { OwnerId: mongoose.Types.ObjectId(req.user.userid) },
            {
              $push: {
                Graduation: {
                  deptname: req.body.department,
                  pdf: {
                    data: fs.readFileSync(
                      path.join(pathname, req.file.filename)
                    ),
                    contentType: path
                      .extname(req.file.filename)
                      .replace(".", ""),
                    filename: req.file.filename,
                  },
                },
              },
            },
            { new: true },

            function (err, data) {
              if (!err) {
                res.status(200).json({
                  data,
                });
              }
            }
          );
        }
      }
    }
  });
}
module.exports = {
  prospectus_attachmentUpload_undergrad,
  prospectus_attachmentUpload_grad,
};
