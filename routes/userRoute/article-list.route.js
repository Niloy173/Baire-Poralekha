const express = require("express");

const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");

const { ArticleModel } = require("../../model/CreateArticleSchema");

const router = express.Router();

router.get(
  "/article-list",
  decorateHtmlResponse("Articles"),
  async (req, res) => {
    const data = await ArticleModel.find({ category: "Article" }).sort(
      "-createdAt"
    );
    res.render("article-list", {
      data,
    });
  }
);

module.exports = {
  router,
};
