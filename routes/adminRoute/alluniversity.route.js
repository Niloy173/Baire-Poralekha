const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const {
  decorateHtmlResponse,
} = require("../../middlewares/common/decorateHtmlResponse");
const { AuthCheck } = require("../../helpers/checker");

const {
  GetAllUniversityCard,
} = require("../../controller/adminController/alluniversity-admin");

const {
  PreviewSingleUniversity,
} = require("../../controller/adminController/showuniversity-admin");

const {
  university_attachmentUpload,
} = require("../../middlewares/university/universityImage");

const {
  StoreUniversityFormData,
} = require("../../controller/createuniversity/universityform");

const { UniversityModel } = require("../../model/UniversitySchema");

const {
  attachmentUpload,
} = require("../../middlewares/university/countryImage");

const {
  prospectus_attachmentUpload,
} = require("../../middlewares/university/propspectusPdf");

const router = express.Router();

router.get(
  "/all-university-dashboard",
  decorateHtmlResponse("All University"),
  AuthCheck,
  GetAllUniversityCard
);

router.get(
  "/all-university-dasboard/:id",
  decorateHtmlResponse("University"),
  AuthCheck,
  PreviewSingleUniversity
);

router.get(
  "/all-university-dashboard/:id/countrydata-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  async (req, res, next) => {
    const currentUniversityId = req.originalUrl.split("/").reverse()[1];
    const data = await UniversityModel.findOne({
      _id: mongoose.Types.ObjectId(currentUniversityId),
    });

    res.render("Forms/countrySelection", {
      data,
    });
  }
);

router.get(
  "/all-university-dashboard/:id/universitydata-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  async (req, res, next) => {
    const currentUniversityId = req.originalUrl.split("/").reverse()[1];
    const data = await UniversityModel.findOne({
      _id: mongoose.Types.ObjectId(currentUniversityId),
    });

    const gradProgram = data.GradProgram.toString().split(",").join("\n");
    const undergradProgram = data.UnderGradProgram.toString()
      .split(",")
      .join("\n");

    res.render("Forms/universityForm", {
      data,
      gradProgram,
      undergradProgram,
    });
  }
);

router.get(
  "/all-university-dashboard/:id/prospectus-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  async (req, res, next) => {
    const currentUniversityId = req.originalUrl.split("/").reverse()[1];
    const data = await UniversityModel.findOne({
      _id: mongoose.Types.ObjectId(currentUniversityId),
    });

    res.render("Forms/prospectusInfo", {
      data,
    });
  }
);

router.post(
  "/all-university-dashboard/:id/countrydata-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  attachmentUpload
);

router.post(
  "/all-university-dashboard/:id/universitydata-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  university_attachmentUpload,
  StoreUniversityFormData
);

router.post(
  "/all-university-dashboard/:id/prospectus-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  prospectus_attachmentUpload,
  (req, res, next) => {
    res.redirect("/admin/dashboard");
  }
);

module.exports = {
  router,
};
