const { ArticleModel } = require("../../model/CreateArticleSchema");

async function Get_me_specific_range_notice(req, res, next) {
  try {
    const pagenum = req.params.pagenumber ? parseInt(req.params.pagenumber) : 1;

    const data = await ArticleModel.find(
      { category: "Notice" },
      { articleImage: 0 }
    ).sort("-createdAt");

    // want to show five page number per load
    const startingIndex = pagenum * 10 - 10;
    const endingIndex =
      pagenum * 10 >= data.length ? data.length : pagenum * 10;

    // how many pages needed
    const totalPage = Math.ceil(data.length / 10);

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
    const search_value = req.params.searchKey.trim();
    let regexExpo = "";

    if (search_value.includes("-")) {
      regexExpo = new RegExp(search_value.split("-").join("/"));
    } else {
      regexExpo = new RegExp(search_value);
    }

    const data = [];

    ArticleModel.find(
      { category: "Notice" },
      { articleImage: 0 },
      function (err, info) {
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
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function Get_me_single_notice(req, res, next) {
  const noticeId = req.params.id;

  const singleNotice = await ArticleModel.findOne({ _id: noticeId });

  const all_notice = await ArticleModel.find({ category: "Notice" });

  let position = 0,
    previous_index = 0,
    next_index = 0;

  for (let index = 0; index < all_notice.length; index++) {
    if (singleNotice.title === all_notice[index].title) {
      position = index;
      break;
    }
  }

  if (position === 0) {
    previous_index = all_notice.length - 1;
    next_index = all_notice[position + 1] ? position + 1 : 0;
  } else if (position === all_notice.length - 1) {
    previous_index = position - 1;
    next_index = all_notice.length > 2 ? 0 : position;
  } else {
    previous_index = position - 1;
    next_index = position + 1;
  }

  res.render("single-notice", {
    singleNotice,
    all_notice,
    previous_index,
    next_index,
    creationDate: singleNotice.date.split("/").join("-"),
  });
}

module.exports = {
  Get_me_specific_range_notice,
  Get_particular_notice_with_filter,
  Get_me_single_notice,
};
