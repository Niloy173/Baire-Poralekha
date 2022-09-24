// this function is called when admins trying to create a new
// university for the same country, so we store the info to the
// universityVerification table from Counrty Table

const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");
const { CountryModel } = require("../../model/CountrySchma");

async function SaveCountryDetails(req, res, next) {
  // first fetch data from countryModel
  const countrydata = await CountryModel.find({
    countryName: req.params.country,
  });

  // then store the data to the universityVerification table
  universityVerificationModel
    .updateOne(
      { OwnerId: req.user.userid },
      {
        $set: {
          countryName: countrydata[0].countryName,
          countryDetails: countrydata[0].countryDetails,
          countryImage: countrydata[0].countryImage,
        },
      },
      { new: true, useFindAndModify: false },
      function (err, data) {
        if (!err) {
          res.send("all ok! do redirect");
        }
      }
    )
    .clone();
}

module.exports = {
  SaveCountryDetails,
};
