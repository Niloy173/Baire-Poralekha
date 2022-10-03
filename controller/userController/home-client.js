// this file is responsible for all the data fetching from
// database on various perspective

const { ArticleModel } = require("../../model/CreateArticleSchema");
const { BannerModel } = require("../../model/BannerSchema");
const { CountryModel } = require("../../model/CountrySchma");
async function Get_me_all_data(req, res, next) {
  // get the countries;
  const countries = await CountryModel.find({}).limit(8);

  // get the banner
  const banner = await BannerModel.find({}).limit(4).sort("-createdAt");

  // notice function
  const notice = await ArticleModel.find(
    { category: "Notice" },
    { articleImage: 0 }
  )
    .limit(5)
    .sort("-createdAt");

  // article function
  const articles = await ArticleModel.find({
    category: "Article",
  })
    .limit(4)
    .sort("-createdAt");

  // render the home page
  res.render("home", {
    notice,
    banner,
    countries,
    articles,
  });
}

module.exports = {
  Get_me_all_data,
};
