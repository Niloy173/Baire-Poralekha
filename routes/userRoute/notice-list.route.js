const express = require("express");

const {
  Get_me_specific_range_notice,
  Get_particular_notice_with_filter,
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

// single notice render
router.get("/:id", decorateHtmlResponse("Notice"), (req, res, next) => {
  res.render("single-notice");
});

router.post("/all-notice-list/:pagenumber", Get_me_specific_range_notice);

// router.post("/all-notice-list/search/:newly_notice_id", (req, res, next) => {
//   res.send("success");
// });

router.post(
  "/all-notice-list/filter/:filter_value/:searchKey",
  Get_particular_notice_with_filter
);

module.exports = {
  router,
};
