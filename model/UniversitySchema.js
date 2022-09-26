const mongoose = require("mongoose");

const UniversitySchema = mongoose.Schema(
  {
    country: {
      type: mongoose.Types.ObjectId,
      ref: "Countries",
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
    UnderGraduation: [
      {
        deptname: String,
        pdf: {
          data: Buffer,
          contentType: String,
          filename: String,
        },
      },
    ],
    Graduation: [
      {
        deptname: String,
        pdf: {
          data: Buffer,
          contentType: String,
          filename: String,
        },
      },
    ],
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
