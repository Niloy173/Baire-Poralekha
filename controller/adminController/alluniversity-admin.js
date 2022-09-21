const { UniversityModel } = require("../../model/UniversitySchema");
const createError = require("http-errors");

function GetAllUniversityCard(req, res, next) {
  new UniversityModel().ShowAllUniversity((err, data) => {
    if (err) {
      throw createError(err.message);
    } else {
      res.render("admin/alluniversity", {
        data,
      });
    }
  });
}

module.exports = {
  GetAllUniversityCard,
};
