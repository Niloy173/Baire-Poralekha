const jwt = require("jsonwebtoken");

const DecodeInformation = (req, res, next) => {
  const token = req.signedCookies[process.env.COOKIE_NAME];

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    req.user = decoded;

    if (res.locals.html === true) {
      res.locals.userInformation = decoded;
    }
  } catch (error) {
    if (res.locals.html === true) {
      res.locals.userInformation = {};
    }
  }

  next();
};

const AuthCheck = (req, res, next) => {
  const token = req.signedCookies[process.env.COOKIE_NAME];

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    req.user = decoded;

    if (res.locals.html === true) {
      res.locals.userInformation = decoded;
    }

    next();
  } catch (error) {
    // console.log("Authentication Error");
    res.redirect("/login");
  }
};

const redirectLoggedIn = (req, res, next) => {
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    let token = cookies[process.env.COOKIE_NAME];
    if (token) {
      res.redirect("/");
    } else {
      next();
    }
  } else {
    next();
  }
};

const RoleBaseAuthorize = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.render("error", {
      title: "Error page",
      status: 400,
      message: "You're not authorized to access this url",
    });
  }
};

module.exports = {
  DecodeInformation,
  AuthCheck,
  redirectLoggedIn,
  RoleBaseAuthorize,
};
