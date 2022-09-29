const fs = require("fs");
const path = require("path");
const lodash = require("lodash");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");
const { CountryModel } = require("../../model/CountrySchma");

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
    const prospectusFilename_Grad =
      CurrentUniversityData.Graduation.length != 0
        ? CurrentUniversityData.Graduation[
            CurrentUniversityData.Graduation.length - 1
          ].pdf.filename
        : "no-pdf-found";

    const prospectusFilename_underGrad =
      CurrentUniversityData.UnderGraduation.length != 0
        ? CurrentUniversityData.UnderGraduation[
            CurrentUniversityData.UnderGraduation.length - 1
          ].pdf.filename
        : "no-pdf-found";

    // check out if this country already avaliable in country table
    const findCountry = await CountryModel.findOne({
      countryName: CurrentUniversityData.countryName,
    });

    if (findCountry == null) {
      const newCountryData = new CountryModel({
        countryName: CurrentUniversityData.countryName,
        countryDetails: CurrentUniversityData.countryDetails,
        countryImage: CurrentUniversityData.countryImage,
      });

      //save the country information
      const newCountry = await newCountryData.save();
      universityInfo.country = newCountry._id;
    } else {
      universityInfo.country = findCountry._id;
    }

    universityInfo.universityName = CurrentUniversityData.universityName;
    universityInfo.universityCover = CurrentUniversityData.universityCover;
    universityInfo.rank = CurrentUniversityData.rank;
    universityInfo.type = CurrentUniversityData.type;
    universityInfo.location = CurrentUniversityData.location;
    universityInfo.introduction = CurrentUniversityData.introduction;
    universityInfo.UnderGraduation =
      CurrentUniversityData.UnderGraduation.length != 0
        ? CurrentUniversityData.UnderGraduation
        : [];
    universityInfo.Graduation =
      CurrentUniversityData.Graduation.length != 0
        ? CurrentUniversityData.Graduation
        : [];

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

    // last file can be undergrad or grad based on the form fill up perspective
    fs.readdir(path_of_pdfData, (err, files) => {
      for (let file of files) {
        if (
          file === prospectusFilename_Grad ||
          file === prospectusFilename_underGrad
        ) {
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
            Graduation: [],
            UnderGraduation: [],
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

    // save the newly created university
    const newUniversity = await newUniversityData.save();

    // save the versity creation id into co-responding country table
    CountryModel.updateOne(
      { countryName: CurrentUniversityData.countryName },
      {
        $push: {
          universities: newUniversity._id,
        },
      },
      {
        new: true,
      },
      function (err, data) {
        if (!err) {
          res.status(200).send("Success");
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Failure");
  }
}

module.exports = {
  CreateUniversity,
};
