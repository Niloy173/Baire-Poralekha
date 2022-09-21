const express = require("express");

const {
  decorateHtmlResponse,
} = require("../middlewares/common/decorateHtmlResponse");

const { DecodeInformation } = require("../helpers/checker");
const { GetProfileAvatar } = require("../helpers/getprofileavatar");

const router = express.Router();

router.get(
  "/",
  decorateHtmlResponse("Home"),
  DecodeInformation,
  GetProfileAvatar,
  (req, res, next) => {
    res.render("home");
  }
);

router.delete("/", (req, res, next) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("signing out");
});

module.exports = {
  router,
};
