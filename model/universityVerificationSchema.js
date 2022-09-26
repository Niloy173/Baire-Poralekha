const mongoose = require("mongoose");

const universityVerificationSchmea = new mongoose.Schema(
  {
    OwnerId: mongoose.Types.ObjectId,
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

const universityVerificationModel = mongoose.model(
  "UniversityVerification",
  universityVerificationSchmea
);

module.exports = {
  universityVerificationModel,
};
