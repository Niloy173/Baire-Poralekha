const path = require("path");

function decorateHtmlResponse(page_title) {
  return function (req, res, next) {
    res.locals.userInformation = {};
    res.locals.errors = {};
    res.locals.profileImage = "";
    res.locals.html = true;
    res.locals.title = `${page_title} | ${process.env.APP_NAME}`;
    next();
  };
}

module.exports = {
  decorateHtmlResponse,
};
