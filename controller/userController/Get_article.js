const { ArticleModel } = require("../../model/CreateArticleSchema");
const mongoose = require("mongoose");

async function Get_me_specific_range_article(req, res, next) {
  try {
    const pagenum = req.params.pagenumber ? parseInt(req.params.pagenumber) : 1;

    const data = await ArticleModel.find({
      category: "Article",
    }).sort("-createdAt");

    const startingIndex = pagenum * 6 - 6;
    const endingIndex = pagenum * 6 >= data.length ? data.length : pagenum * 6;

    const totalPage = Math.ceil(data.length / 6);

    const default_number = pagenum === 1 ? 1 : pagenum;

    res.render("article-list", {
      startingIndex,
      endingIndex,
      totalPage,
      data,
      default_number,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send(error);
  }
}

async function Get_particular_article_with_filter(req, res, next) {
  try {
    const filter_value = req.params.filter_value.trim();
    const search_value = req.params.searchKey.trim();

    let regexExpo = "";

    if (search_value.includes("-")) {
      regexExpo = new RegExp(search_value.split("-").join("/"));
    } else {
      regexExpo = new RegExp(search_value);
    }

    const articleData = [];

    ArticleModel.find({ category: "Article" }, function (err, info) {
      for (let index = 0; index < info.length; index++) {
        const { date, articleImage, title, content, _id } = info[index];

        if (date.match(regexExpo) != null || title.match(regexExpo) != null) {
          articleData.push({
            date,
            articleImage,
            title,
            content,
            _id,
          });
        }
      }

      // console.log(articleData.length);
      if (articleData.length > 0) {
        res.status(200).json({
          data: articleData,
        });
      } else {
        res.status(500).json({
          error: "no data found",
        });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function Get_me_single_article(req, res, next) {
  try {
    const articleId = req.params.article_id;

    // find the specific article
    const singleArticle = await ArticleModel.findOne({
      _id: mongoose.Types.ObjectId(articleId),
    });

    // fetch all data
    const all_article = await ArticleModel.find({ category: "Article" });

    // find the current article position in the array
    let position = 0,
      previous_index = 0,
      next_index = 0;
    for (let index = 0; index < all_article.length; index++) {
      if (singleArticle.title === all_article[index].title) {
        position = index;
        break;
      }
    }

    if (position === 0) {
      previous_index = all_article.length - 1;
      next_index = all_article[position + 1] ? position + 1 : 0;
      // if there are only one article
      // current & next should be same
    } else if (position === all_article.length - 1) {
      previous_index = position - 1;
      next_index = all_article.length > 2 ? 0 : position;
      // if there are only two articles next should be
      // current one
    } else {
      previous_index = position - 1;
      next_index = position + 1;
    }

    res.render("single-article", {
      all_article,
      singleArticle,
      previous_index,
      next_index,
      fixedArticleToRender: all_article.length > 4 ? 4 : all_article.length,
      creationDate: new Date(singleArticle.createdAt)
        .toDateString()
        .substring(4),
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send(error);
  }
}
module.exports = {
  Get_me_specific_range_article,
  Get_particular_article_with_filter,
  Get_me_single_article,
};
