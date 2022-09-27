const mongoose = require("mongoose");
const { UniversityModel } = require("../../model/UniversitySchema");
const createError = require("http-errors");

async function PreviewSingleUniversity(req, res, next) {
  try {
    const { id } = req.params;

    const data = await UniversityModel.find({
      _id: mongoose.Types.ObjectId(id),
    }).populate("country", "countryName");

    res.render("admin/previewUniversity", {
      data,
    });
  } catch (error) {
    res.send(error.message);
  }
}

module.exports = {
  PreviewSingleUniversity,
};
