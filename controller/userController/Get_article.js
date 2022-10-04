const { ArticleModel } = require("../../model/CreateArticleSchema");

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

module.exports = {
  Get_me_specific_range_article,
  Get_particular_article_with_filter,
};
