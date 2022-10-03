const { ArticleModel } = require("../../model/CreateArticleSchema");

async function Get_me_specific_range_notice(req, res, next) {
  try {
    const pagenum = req.params.pagenumber ? parseInt(req.params.pagenumber) : 1;

    const data = await ArticleModel.find(
      { category: "Notice" },
      { articleImage: 0 }
    ).sort("-createdAt");

    // want to show five page number per load
    const startingIndex = pagenum * 5 - 5;
    const endingIndex = pagenum * 5 >= data.length ? data.length : pagenum * 5;

    // how many pages needed
    const totalPage = Math.ceil(data.length / 5);

    // page to highlight
    const default_number = pagenum === 1 ? 1 : pagenum;

    if (res.locals.html) {
      res.render("notice-list", {
        startingIndex,
        endingIndex,
        totalPage,
        data,
        default_number,
      });
    } else {
      res.json({
        information: {
          startingIndex,
          endingIndex,
          totalPage,
          data,
          default_number,
        },
      });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send(error);
  }
}

async function Get_particular_notice_with_filter(req, res, next) {
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

    ArticleModel.find({}, { articleImage: 0 }, function (err, info) {
      for (let index = 0; index < info.length; index++) {
        const { date, title, _id } = info[index];

        if (date.match(regexExpo) != null || title.match(regexExpo) != null) {
          data.push({
            date,
            title,
            _id,
          });
        }
      }
      if (data.length > 0) {
        res.status(200).json({
          data,
        });
      } else {
        res.status(500).send("no data found");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

module.exports = {
  Get_me_specific_range_notice,
  Get_particular_notice_with_filter,
};
