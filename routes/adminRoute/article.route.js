const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");

const { AuthCheck } = require("../../helpers/checker");

const {
  articleImageUpload,
} = require("../../middlewares/article/articleImage");

const {
  PostArticle,
} = require("../../controller/adminController/createarticle-admin");

const { ArticleModel } = require("../../model/CreateArticleSchema");

const router = express.Router();

router.get(
  "/articles",
  decorateHtmlResponse("Articles"),
  AuthCheck,
  async (req, res, next) => {
    const data = await ArticleModel.find({}, { articleImage: 0 });
    res.render("admin/allarticle", {
      data,
    });
  }
);

router.get(
  "/articles/create-article",
  decorateHtmlResponse("Create Article"),
  AuthCheck,
  (req, res, next) => {
    res.render("admin/articlewriting");
  }
);

router.get(
  "/articles/:id/preview-article",
  decorateHtmlResponse("Article"),
  AuthCheck,
  async (req, res, next) => {
    const { id } = req.params;
    const data = await ArticleModel.findOne({
      _id: mongoose.Types.ObjectId(id),
    });
    res.render("admin/articlewriting", {
      data,
    });
  }
);

router.post(
  "/articles/create-article",
  decorateHtmlResponse("Create Article"),
  AuthCheck,
  articleImageUpload,
  PostArticle
);

router.post(
  "/articles/:id/preview-article",
  decorateHtmlResponse("Article"),
  AuthCheck,
  articleImageUpload,
  PostArticle
);
module.exports = {
  router,
};
