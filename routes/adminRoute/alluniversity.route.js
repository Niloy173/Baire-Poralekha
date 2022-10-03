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
  prospectus_attachmentUpload_undergrad,
  prospectus_attachmentUpload_grad,
} = require("../../middlewares/university/propspectusPdf");

const {
  Delete_particular_prospectus_grad,
  Delete_particular_prospectus_undergrad,
} = require("../../controller/adminController/prospectusDelete-admin");

const {
  Delete_university,
} = require("../../controller//adminController/delete_particular_university");

const { CountryModel } = require("../../model/CountrySchma");

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
    const countryId = req.originalUrl.split("/").reverse()[1];
    const data = await CountryModel.findOne({
      _id: mongoose.Types.ObjectId(countryId),
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

    res.render("Forms/universityForm", {
      data,
    });
  }
);

router.get(
  "/all-university-dashboard/:id/undergraduation-prospectus-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  async (req, res, next) => {
    const currentUniversityId = req.originalUrl.split("/").reverse()[1];
    const data = await UniversityModel.findOne({
      _id: mongoose.Types.ObjectId(currentUniversityId),
    });

    res.render("Forms/undergraduateProspectus", {
      data,
    });
  }
);

router.get(
  "/all-university-dashboard/:id/graduation-prospectus-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  async (req, res, next) => {
    const currentUniversityId = req.originalUrl.split("/").reverse()[1];
    const data = await UniversityModel.findOne({
      _id: mongoose.Types.ObjectId(currentUniversityId),
    });

    res.render("Forms/graduateProspectus", {
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
  "/all-university-dashboard/:id/undergraduation-prospectus-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  prospectus_attachmentUpload_undergrad
);

router.post(
  "/all-university-dashboard/:id/graduation-prospectus-update",
  decorateHtmlResponse("Update University"),
  AuthCheck,
  prospectus_attachmentUpload_grad
);

router.delete(
  "/all-university-dashboard/:id/undergraduation-prospectus-update/:update_dept_id",
  AuthCheck,
  Delete_particular_prospectus_undergrad
);

router.delete(
  "/all-university-dashboard/:id/graduation-prospectus-update/:update_dept_id",
  AuthCheck,
  Delete_particular_prospectus_grad
);

router.delete(
  "/all-university-dashboard/:id/delete-university",
  AuthCheck,
  Delete_university
);
module.exports = {
  router,
};
