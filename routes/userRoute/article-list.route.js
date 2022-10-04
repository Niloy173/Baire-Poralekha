const express = require("express");

const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");

const { ArticleModel } = require("../../model/CreateArticleSchema");

const {
  Get_me_specific_range_article,
  Get_particular_article_with_filter,
} = require("../../controller/userController/Get_article");

const router = express.Router();

router.get(
  "/article-list",
  decorateHtmlResponse("Articles"),
  Get_me_specific_range_article
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
