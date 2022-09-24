const mongoose = require("mongoose");

const CountrySchema = mongoose.Schema(
  {
    countryName: String,
    countryDetails: String,
    countryImage: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
  },
  {
    timestamps: true,
  }
);

const CountryModel = mongoose.model("Countries", CountrySchema);

module.exports = {
  CountryModel,
};
