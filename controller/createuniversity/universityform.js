const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");
const { default: mongoose } = require("mongoose");

function StoreUniversityFormData(req, res, next) {
  const grad_program = req.body.graduate.split(/\r?\n/);
  const undergrad_program = req.body.undergraduate.split(/\r?\n/);

  const UpdatedroutePath = req.originalUrl.split("/").reverse()[0];

  if (UpdatedroutePath === "universitydata-update") {
    const currentUniversityId = req.originalUrl.split("/").reverse()[1];

    UniversityModel.updateOne(
      { _id: mongoose.Types.ObjectId(currentUniversityId) },
      {
        $set: {
          universityName: req.body.universityname.trim(),
          rank: req.body.rank.trim(),
          type: req.body.type.trim(),
          location: req.body.location.trim(),
          introduction: req.body.universityintro.trim(),
          UnderGradProgram: undergrad_program,
          GradProgram: grad_program,
        },
      },

      { new: true, useFindAndModify: false },

      function (err, data) {
        if (!err) {
          setTimeout(() => {
            res.redirect(
              `/admin/all-university-dashboard/${currentUniversityId}/prospectus-update`
            );
          }, 1000);
        }
      }
    );
  } else {
    universityVerificationModel.updateOne(
      { OwnerId: req.user.userid },
      {
        $set: {
          universityName: req.body.universityname.trim(),
          rank: req.body.rank.trim(),
          type: req.body.type.trim(),
          location: req.body.location.trim(),
          introduction: req.body.universityintro.trim(),
          UnderGradProgram: undergrad_program,
          GradProgram: grad_program,
        },
      },

      { new: true, useFindAndModify: false },

      function (err, data) {
        if (!err) {
          setTimeout(() => {
            res.redirect("/admin/prospectusupdate");
          }, 1000);
        }
      }
    );
  }
}

module.exports = {
  StoreUniversityFormData,
};
