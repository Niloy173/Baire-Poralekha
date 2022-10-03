const mongoose = require("mongoose");
const { CountryModel } = require("../../model/CountrySchma");
const { UniversityModel } = require("../../model/UniversitySchema");

async function Delete_university(req, res, next) {
  try {
    const university_id = req.params.id;

    const university_data = await UniversityModel.findOne({
      _id: mongoose.Types.ObjectId(university_id),
    }).populate("country");

    const { universities, _id } = university_data.country;

    const arr_of_ids = [];

    for (const val of universities) {
      if (val != university_id) {
        arr_of_ids.push(val);
      }
    }

    CountryModel.updateOne(
      { _id: _id },
      {
        $set: {
          universities: arr_of_ids,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      },
      function (err, data) {
        if (!err) {
          UniversityModel.deleteOne(
            {
              _id: mongoose.Types.ObjectId(university_id),
            },
            function (err) {
              if (!err) {
                res.status(200).send("University Deleted");
              } else {
                res.status(500).send("Failed to update university");
              }
            }
          );
        } else {
          res.status(500).send("Failed to update countryData");
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

module.exports = {
  Delete_university,
};
