const { check, validationResult } = require("express-validator");

const doUniversityFormValdiator = [
  check("rank", "Rank number is required").notEmpty().trim(),

  check("type", "type is required").notEmpty().isString().trim(),

  check("location", "location is required").notEmpty().isString().trim(),

  check("universityname", "university name is required")
    .notEmpty()
    .isString()
    .trim(),

  check("universityintro", "university description is required")
    .notEmpty()
    .isString()
    .trim(),

  check("graduate", "graduation program required").notEmpty().isString().trim(),

  check("undergraduate", "undergraduate program required")
    .notEmpty()
    .isString()
    .trim(),
];

const doUniversityFormHandler = function (req, res, next) {
  const error = validationResult(req);
  const mappedError = error.array();

  if (Object.keys(mappedError).length === 0) {
    next();
  } else {
    res.render("Forms/universityForm", {
      error: mappedError,
    });
  }
};

module.exports = {
  doUniversityFormValdiator,
  doUniversityFormHandler,
};
