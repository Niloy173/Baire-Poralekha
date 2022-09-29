const express = require("express");
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const path = require("path");

/* internal package */
const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");

const { AuthCheck, RoleBaseAuthorize } = require("../../helpers/checker");

const {
  attachmentUpload,
} = require("../../middlewares/university/countryImage");

const {
  university_attachmentUpload,
} = require("../../middlewares/university/universityImage");

const {
  doUniversityFormHandler,
  doUniversityFormValdiator,
} = require("../../middlewares/formvalidation/university-details-form");

const {
  StoreUniversityFormData,
} = require("../../controller/createuniversity/universityform");

const {
  prospectus_attachmentUpload_undergrad,
  prospectus_attachmentUpload_grad,
} = require("../../middlewares/university/propspectusPdf");

const {
  CreateUniversity,
} = require("../../controller/createuniversity/createUniversity");

const {
  SaveCountryDetails,
} = require("../../controller/adminController/countrydatafetch-admin");

const {
  Delete_particular_prospectus_undergrad,
  Delete_particular_prospectus_grad,
} = require("../../controller/adminController/prospectusDelete-admin");

const { bannerUpload } = require("../../middlewares/banner/bannerImage");

const {
  PostBanner,
} = require("../../controller/adminController/createbanner-admin");

const { UniversityModel } = require("../../model/UniversitySchema");
const { UserModel } = require("../../model/UserSchema");
const { ArticleModel } = require("../../model/CreateArticleSchema");
const { CountryModel } = require("../../model/CountrySchma");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { BannerModel } = require("../../model/BannerSchema");

/*---------------------*/

const router = express.Router();

router.get(
  "/dashboard",
  decorateHtmlResponse("admin"),
  AuthCheck,
  RoleBaseAuthorize,
  async (req, res, next) => {
    const user = await UserModel.find({ role: "user" });
    const university = await UniversityModel.find({});
    const Article = await ArticleModel.find({});
    const country = await CountryModel.find({});
    const banner = await BannerModel.find({});
    // const numofCountries = country
    //   .map((item) => item.countryName)
    //   .filter((value, position, array) => array.indexOf(value) === position);

    res.render("admin/adminPannel", {
      usercount: user.length,
      universitycount: university.length,
      articlecount: Article.length,
      countries: country.length,
      banner: banner.length,
    });
  }
);

// routing for countries
router.get(
  "/countries",
  decorateHtmlResponse("All Countries"),
  AuthCheck,
  async (req, res, next) => {
    const countryData = await CountryModel.find({});
    res.render("admin/countrySection", {
      countryData,
    });
  }
);

// routing for banner
router.get(
  "/banners",
  decorateHtmlResponse("Banner"),
  AuthCheck,
  async (req, res, next) => {
    const bannerData = await BannerModel.find({});
    res.render("admin/allbanner", {
      bannerData,
    });
  }
);

router.get(
  "/banner/create-banner",
  decorateHtmlResponse("Banner Creation"),
  AuthCheck,
  (req, res, next) => {
    res.render("Forms/bannerSelection");
  }
);

router.get(
  "/banner/:id/preview-banner",
  decorateHtmlResponse("Preview Banner"),
  AuthCheck,
  async (req, res, next) => {
    const data = await BannerModel.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    res.render("Forms/bannerSelection", {
      data,
    });
  }
);

// routing for all universities under single country
router.get(
  "/countries/:country_id/:country_name",
  decorateHtmlResponse("All University"),
  AuthCheck,
  async (req, res, next) => {
    const countryinfo = await CountryModel.findOne({
      _id: mongoose.Types.ObjectId(req.params.country_id),
    }).populate("universities");

    const { universities } = countryinfo;

    res.render("admin/university_under_country", {
      data: universities,
    });
  }
);

// university-form
router.get(
  "/universityform",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  (req, res, next) => {
    res.render("Forms/universityForm");
  }
);

// country-form
router.get(
  "/countryselection",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  async (req, res, next) => {
    const countryData = await CountryModel.find({});
    const country = countryData
      .map((item) => item.countryName)
      .filter((value, position, array) => array.indexOf(value) === position);
    res.render("Forms/countrySelection", {
      country,
    });
  }
);

//prospectus-form-undergrad
router.get(
  "/undergraduate-prospectus",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  (req, res, next) => {
    res.render("Forms/undergraduateProspectus");
  }
);

//prospectus-form-grad
router.get(
  "/graduate-prospectus",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  (req, res, next) => {
    res.render("Forms/graduateProspectus");
  }
);

// create university page
router.get(
  "/create-university",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  async (req, res, next) => {
    const data = await universityVerificationModel.findOne({
      OwnerId: req.user.userid,
    });

    res.render("admin/confirmation", {
      data,
    });
  }
);

router.post(
  "/countryselection",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  attachmentUpload
);

// routing for existing country with button
router.post(
  "/save-country-information/:country",
  AuthCheck,
  SaveCountryDetails
);

router.post(
  "/universityform",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  university_attachmentUpload,
  doUniversityFormValdiator,
  doUniversityFormHandler,
  StoreUniversityFormData
);

router.post(
  "/undergraduate-prospectus",
  AuthCheck,
  prospectus_attachmentUpload_undergrad
);

router.post(
  "/graduate-prospectus",
  AuthCheck,
  prospectus_attachmentUpload_grad
);

router.post(
  "/undergraduate-prospectus/:dept_id",
  AuthCheck,
  Delete_particular_prospectus_undergrad
);

router.post(
  "/graduate-prospectus/:dept_id",
  AuthCheck,
  Delete_particular_prospectus_grad
);

router.post("/create-university", AuthCheck, CreateUniversity);

router.post(
  "/banner/create-banner",
  decorateHtmlResponse("Banner"),
  AuthCheck,
  bannerUpload,
  PostBanner
);

router.post(
  "/banner/:id/preview-banner",
  decorateHtmlResponse("Preview Banner"),
  AuthCheck,
  bannerUpload,
  PostBanner
);

router.delete("/dashboard", (req, res, next) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("signing out");
});
module.exports = {
  router,
};
