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
    console.log(error);
    res.status(500).send(error);
  }
}

module.exports = {
  Get_me_specific_range_notice,
};
