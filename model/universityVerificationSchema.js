const mongoose = require("mongoose");

const universityVerificationSchmea = new mongoose.Schema(
  {
    OwnerId: mongoose.Types.ObjectId,
    countryName: String,
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

const universityVerificationModel = mongoose.model(
  "UniversityVerification",
  universityVerificationSchmea
);

module.exports = {
  universityVerificationModel,
};
