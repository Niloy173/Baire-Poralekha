const fs = require("fs");
const path = require("path");
const lodash = require("lodash");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");

async function CreateUniversity(req, res, next) {
  try {
    const universityInfo = {};

    const path_of_countryImage = path.join(
      __dirname + "/../" + "/../public/countryimage/"
    );

    const path_of_universityImage = path.join(
      __dirname + "/../" + "/../public/universityimage/"
    );

    const path_of_pdfData = path.join(
      __dirname + "/../" + "/../public/prospectus/"
    );

    const CurrentUniversityData = await universityVerificationModel.findOne({
      OwnerId: req.user.userid,
    });

    const countryFileName = CurrentUniversityData.countryImage.filename;
    const universityFilename = CurrentUniversityData.universityCover.filename;
    const prospectusFilename = CurrentUniversityData.prospectus.filename;

    // all the data related to university
    universityInfo.countryName = CurrentUniversityData.countryName;
    universityInfo.countryImage = CurrentUniversityData.countryImage;
    universityInfo.universityName = CurrentUniversityData.universityName;
    universityInfo.universityCover = CurrentUniversityData.universityCover;
    universityInfo.rank = CurrentUniversityData.rank;
    universityInfo.type = CurrentUniversityData.type;
    universityInfo.location = CurrentUniversityData.location;
    universityInfo.introduction = CurrentUniversityData.introduction;
    universityInfo.UnderGradProgram = CurrentUniversityData.UnderGradProgram;
    universityInfo.GradProgram = CurrentUniversityData.GradProgram;
    universityInfo.prospectus = CurrentUniversityData.prospectus;

    const newUniversityData = new UniversityModel().InsertUniversity(
      universityInfo
    );

    // delete the file
    fs.readdir(path_of_countryImage, (err, files) => {
      for (let file of files) {
        if (file === countryFileName) {
          fs.unlink(path.join(path_of_countryImage, file), (err) => {
            if (err) {
              console.log(err.message);
            }
          });
        }
      }
    });

    fs.readdir(path_of_universityImage, (err, files) => {
      for (let file of files) {
        if (file === universityFilename) {
          fs.unlink(path.join(path_of_universityImage, file), (err) => {
            if (err) {
              console.log(err.message);
            }
          });
        }
      }
    });

    fs.readdir(path_of_pdfData, (err, files) => {
      for (let file of files) {
        if (file === prospectusFilename) {
          fs.unlink(path.join(path_of_pdfData, file), (err) => {
            if (err) {
              console.log(err.message);
            }
          });
        }
      }
    });

    // update the schema for verification table
    const updateVerificationSchema =
      await universityVerificationModel.updateOne(
        {
          OwnerId: req.user.userid,
        },
        {
          $set: {
            countryName: "",
            countryImage: {},
            universityName: "",
            universityCover: {},
            rank: "",
            type: "",
            location: "",
            introduction: "",
            UnderGradProgram: [],
            GradProgram: [],
            prospectus: {},
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

    // save the newly created university
    newUniversityData.save();

    setTimeout(() => {
      res.status(200).redirect("/admin/dashboard");
    }, 1000);
  } catch (error) {
    console.log(error);
    res.redirect("/admin/dashboard");
  }
}

module.exports = {
  CreateUniversity,
};
