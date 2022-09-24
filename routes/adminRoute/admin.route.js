const express = require("express");
const fs = require("fs");
const path = require("path");

/* internal package */
const {ArticleModel}= require("../../model/CreateArticleSchema")
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
  prospectus_attachmentUpload,
} = require("../../middlewares/university/propspectusPdf");

const {
  CreateUniversity,
} = require("../../controller/createuniversity/createUniversity");

const {
  SaveCountryDetails,
} = require("../../controller/adminController/countrydatafetch-admin");

const { UniversityModel } = require("../../model/UniversitySchema");
const { UserModel } = require("../../model/UserSchema");
const { ArticleModel } = require("../../model/CreateArticleSchema");
const { CountryModel } = require("../../model/CountrySchma");
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
    const country = university
      .map((item) => item.countryName)
      .filter((value, position, array) => array.indexOf(value) === position);

    res.render("admin/adminPannel", {
      usercount: user.length,
      universitycount: university.length,
      articlecount: Article.length,
      countries: country.length,
    });
  }
);

// routing for countries
router.get(
  "/countries",
  decorateHtmlResponse("All Countries"),
  AuthCheck,
  (req, res, next) => {}
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

//prospectus-form
router.get(
  "/prospectusupdate",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  (req, res, next) => {
    res.render("Forms/prospectusInfo");
  }
);

// routing for existing country
router.post(
  "/save-country-information/:country",
  AuthCheck,
  SaveCountryDetails
);

router.post(
  "/countryselection",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  attachmentUpload
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
  "/prospectusupdate",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  prospectus_attachmentUpload,
  CreateUniversity
);

router.delete("/dashboard", (req, res, next) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("signing out");
});
module.exports = {
  router,
};
