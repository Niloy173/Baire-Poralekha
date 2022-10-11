const express = require("express");

const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");

const { ArticleModel } = require("../../model/CreateArticleSchema");

const {
  Get_me_specific_range_article,
  Get_particular_article_with_filter,
  Get_me_single_article,
} = require("../../controller/userController/Get_article");

const router = express.Router();

router.get(
  "/article-list",
  decorateHtmlResponse("Articles"),
  Get_me_specific_range_article
);

// single article view
router.get(
  "/:article_id",
  decorateHtmlResponse("Article"),
  Get_me_single_article
);

router.get(
  "/article-list/:pagenumber",
  decorateHtmlResponse("Articles"),
  Get_me_specific_range_article
);

router.get(
  "/article-list/:filter_value/:searchKey",
  Get_particular_article_with_filter
);

module.exports = {
  router,
};
