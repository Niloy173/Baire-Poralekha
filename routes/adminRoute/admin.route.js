const express = require("express");
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
  prospectus_attachmentUpload,
} = require("../../middlewares/university/propspectusPdf");

const {
  CreateUniversity,
} = require("../../controller/createuniversity/createUniversity");

const { UniversityModel } = require("../../model/UniversitySchema");
const { UserModel } = require("../../model/UserSchema");
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
    res.render("admin/adminPannel", {
      usercount: user.length,
      universitycount: university.length,
    });
  }
);

router.get(
  "/universityform",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  (req, res, next) => {
    res.render("Forms/universityForm");
  }
);

router.get(
  "/countryselection",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  (req, res, next) => {
    res.render("Forms/countrySelection");
  }
);

router.get(
  "/prospectusupdate",
  decorateHtmlResponse("Create University"),
  AuthCheck,
  (req, res, next) => {
    res.render("Forms/prospectusInfo");
  }
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

router;
router.delete("/dashboard", (req, res, next) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("signing out");
});
module.exports = {
  router,
};
