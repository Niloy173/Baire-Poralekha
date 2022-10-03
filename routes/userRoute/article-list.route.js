const express = require("express");

const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");

const router = express.Router();

router.get("/article-list", decorateHtmlResponse("Articles"), (req, res) => {
  res.render("article-list");
});

module.exports = {
  router,
};
