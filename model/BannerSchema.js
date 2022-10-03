const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema(
  {
    date: {
      type: String,
    },

    description: {
      type: String,
    },

    banner: {
      data: Buffer,
      contentType: String,
      filename: String,
    },

    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

BannerSchema.methods = {
  CreateBanner: function (obj) {
    const newArticle = new mongoose.model("Banners");
    return newArticle(obj);
  },
};

const BannerModel = new mongoose.model("Banners", BannerSchema);
module.exports = {
  BannerModel,
};
