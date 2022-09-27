const { default: mongoose } = require("mongoose");
const {
  universityVerificationModel,
} = require("../../model/universityVerificationSchema");

const { UniversityModel } = require("../../model/UniversitySchema");

async function Delete_particular_prospectus_undergrad(req, res, next) {
  const UpdatedroutePath = req.originalUrl.split("/").reverse()[1];
  const arr = []; // storing each object expect the deleted id

  if (UpdatedroutePath === "undergraduation-prospectus-update") {
    const currentUniversityId = req.originalUrl.split("/").reverse()[2];

    try {
      const documents = await UniversityModel.findOne({
        _id: currentUniversityId,
      });

      const { UnderGraduation } = documents;

      UnderGraduation.forEach((element) => {
        if (element._id != req.params.update_dept_id) {
          arr.push({
            deptname: element.deptname,
            pdf: element.pdf,
            _id: element._id,
          });
        }
      });

      UniversityModel.updateOne(
        { _id: mongoose.Types.ObjectId(currentUniversityId) },
        {
          $set: {
            UnderGraduation: arr,
          },
        },
        { new: true },
        function (err, data) {
          if (!err) {
            res.status(200).send("success");
          }
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    try {
      const documents = await universityVerificationModel.findOne({
        OwnerId: req.user.userid,
      });
      const { UnderGraduation } = documents;

      UnderGraduation.forEach((element) => {
        if (element._id != req.params.dept_id) {
          arr.push({
            deptname: element.deptname,
            pdf: element.pdf,
            _id: element._id,
          });
        }
      });

      universityVerificationModel.updateOne(
        { OwnerId: mongoose.Types.ObjectId(req.user.userid) },
        {
          $set: {
            UnderGraduation: arr,
          },
        },
        { new: true },
        function (err, data) {
          if (!err) {
            res.status(200).send("success");
          }
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

async function Delete_particular_prospectus_grad(req, res, next) {
  const UpdatedroutePath = req.originalUrl.split("/").reverse()[1];
  const arr = []; // storing each object expect the deleted id

  if (UpdatedroutePath === "graduation-prospectus-update") {
    const currentUniversityId = req.originalUrl.split("/").reverse()[2];

    try {
      const documents = await UniversityModel.findOne({
        _id: currentUniversityId,
      });
      const { Graduation } = documents;

      Graduation.forEach((element) => {
        if (element._id != req.params.update_dept_id) {
          arr.push({
            deptname: element.deptname,
            pdf: element.pdf,
            _id: element._id,
          });
        }
      });
      UniversityModel.updateOne(
        { OwnerId: mongoose.Types.ObjectId(req.user.userid) },
        {
          $set: {
            Graduation: arr,
          },
        },
        { new: true },
        function (err, data) {
          if (!err) {
            res.status(200).send("success");
          }
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    try {
      const documents = await universityVerificationModel.findOne({
        OwnerId: req.user.userid,
      });
      const { Graduation } = documents;

      Graduation.forEach((element) => {
        if (element._id != req.params.dept_id) {
          arr.push({
            deptname: element.deptname,
            pdf: element.pdf,
            _id: element._id,
          });
        }
      });

      universityVerificationModel.updateOne(
        { OwnerId: mongoose.Types.ObjectId(req.user.userid) },
        {
          $set: {
            Graduation: arr,
          },
        },
        { new: true },
        function (err, data) {
          if (!err) {
            res.status(200).send("success");
          }
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = {
  Delete_particular_prospectus_undergrad,
  Delete_particular_prospectus_grad,
};
