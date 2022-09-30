const express = require("express");

const {
  decorateHtmlResponse,
} = require("../middlewares/common/decorateHtmlResponse");

const { DecodeInformation } = require("../helpers/checker");
const { GetProfileAvatar } = require("../helpers/getprofileavatar");

const { Get_me_all_data } = require("../controller/userController/home-client");

const router = express.Router();

router.get(
  "/",
  decorateHtmlResponse("Home"),
  DecodeInformation,
  GetProfileAvatar,
  Get_me_all_data
);

router.delete("/", (req, res, next) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("signing out");
});

module.exports = {
  router,
};
