const mongoose = require("mongoose");

const UniversitySchema = mongoose.Schema(
  {
    countryName: String,
    countryDetails: String,
    countryImage: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
    universityName: String,
    universityCover: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
    rank: String,
    type: String,
    location: String,
    introduction: String,
    UnderGradProgram: [],
    GradProgram: [],
    prospectus: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
  },
  {
    timestamps: true,
  }
);

UniversitySchema.methods = {
  InsertUniversity: function (data) {
    const newUniversity = mongoose.model("University");
    return newUniversity(data);
  },

  ShowAllUniversity: function (cb) {
    return mongoose.model("University").find({}, cb);
  },
};

const UniversityModel = new mongoose.model("University", UniversitySchema);

module.exports = {
  UniversityModel,
};
