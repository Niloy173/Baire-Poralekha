const mongoose = require("mongoose");
const { UniversityModel } = require("../../model/UniversitySchema");
const createError = require("http-errors");

async function PreviewSingleUniversity(req, res, next) {
  try {
    const { id } = req.params;

    const data = await UniversityModel.find({
      _id: mongoose.Types.ObjectId(id),
    });

    const gradProgram = data[0].GradProgram.toString().split(",").join("\n");
    const undergradProgram = data[0].UnderGradProgram.toString()
      .split(",")
      .join("\n");
    res.render("admin/previewUniversity", {
      data,
      gradProgram,
      undergradProgram,
    });
  } catch (error) {
    res.send(error.message);
  }
}

module.exports = {
  PreviewSingleUniversity,
};
