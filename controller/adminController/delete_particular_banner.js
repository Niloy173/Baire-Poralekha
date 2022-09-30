const mongoose = require("mongoose");

const { BannerModel } = require("../../model/BannerSchema");

async function DeleteBanner(req, res, next) {
  try {
    const deletebanner = await BannerModel.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });

    res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

module.exports = {
  DeleteBanner,
};
