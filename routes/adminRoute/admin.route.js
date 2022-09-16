const express = require("express");
const fs = require("fs");
const path = require("path");

/* internal package */
const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");

const router = express.Router();

router.get("/", decorateHtmlResponse("admin"), (req, res, next) => {
  res.render("admin/adminPannel");
});

router.get(
  "/universityform",
  decorateHtmlResponse("create university"),
  (req, res, next) => {
    res.render("Forms/admin/universityForm");
  }
);

router.get(
  "/countryselection",
  decorateHtmlResponse("create university"),
  (req, res, next) => {
    res.render("Forms/admin/countrySelection");
  }
);
module.exports = {
  router,
};
