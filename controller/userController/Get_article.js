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
    const search_value = req.params.searchKey;

    let regexExpo = "";

    if (search_value.includes("-")) {
      regexExpo = new RegExp(search_value.split("-").join("/"));
    } else {
      regexExpo = new RegExp(search_value);
    }

    const data = [];

    ArticleModel.find({ category: "Article" }, function (err, info) {
      for (let index = 0; index < info.length; index++) {
        const { date, title, content, _id } = info[index];

        if (date.match(regexExpo) != null || title.match(regexExpo) != null) {
          data.push({
            date,
            title,
            content,
            _id,
          });
        }
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  Get_me_specific_range_article,
};
