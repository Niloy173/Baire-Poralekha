const createError = require("http-errors");

// 404 not found handler
function NotFoundHandler(req, res, next) {
  next(createError(404, "Your requested content was not found"));
}

// default error handler
function errorHandler(err, req, res, next) {
  res.locals.error = err.message;
  // process.env.NODE_ENV === "development" ? err : { message: err.message };
  res.status(err.status || 500);

  if (!res.locals.html) {
    res.render("error", {
      title: "Error page",
      message: err.message,
      status: err.status,
    });
  } else {
    res.json(res.locals.error);
  }
}

module.exports = {
  NotFoundHandler,
  errorHandler,
};
