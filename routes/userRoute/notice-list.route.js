const express = require("express");

const {
  Get_me_specific_range_notice,
} = require("../../controller/userController/Get_notice");

const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");

const router = express.Router();

router.get(
  "/all-notice-list",
  decorateHtmlResponse("Notice"),
  Get_me_specific_range_notice
);

router.get("/all-notice-list/:id", (req, res, next) => {
  res.send("success");
});

router.post("/all-notice-list/:pagenumber", Get_me_specific_range_notice);

router.post("/all-notice-list/search/:searchKey", (req, res, next) => {
  console.log(req.params.searchKey);
  res.send("success");
});

module.exports = {
  router,
};
