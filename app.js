/* all the packages */
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

/* Internal packages */
const {
  NotFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

/*-------------------*/
require("dotenv").config();

/* app object */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* cookie-parser */
app.use(cookieParser(process.env.COOKIE_SECRET));

/* db connection */
require("./db/connection");

/* variable section */
const staticPath = path.join(__dirname, "/public/");
const templatePath = path.join(__dirname, "/template/views/");
const port_number = process.env.PORT || 5000;
/*------------------*/

/* all types of required here */
const homeRoute = require("./routes/home.route");
const loginRoute = require("./routes/login.route");
const resetpasswordRoute = require("./routes/resetpassword.route");
const registerRoute = require("./routes/register.route");
const noticeRouter = require("./routes//userRoute/notice-list.route");
const adminRoute = require("./routes/adminRoute/admin.route");
const alluniversity_under_adminRoute = require("./routes/adminRoute/alluniversity.route");
const articles_under_adminRoute = require("./routes/adminRoute/article.route");

/* middleware */
app.enable("case sensitive routing");
app.use(express.static(staticPath));
app.use("/article", express.static(`${__dirname}` + "/public/article/"));
app.use("/articleimg", express.static(`${__dirname} + "/public/articleimage/`));
app.use("/css", express.static(`${__dirname}` + "/public/css/"));
app.use("/img", express.static(`${__dirname}` + "/public/images/"));
app.use("/js", express.static(`${__dirname}` + "/public/script/"));
app.use("/pdf", express.static(`${__dirname}` + "/public/prospectus/"));
/*---------------*/

/* view emgine set up */
app.set("view engine", "ejs");
app.set("views", templatePath);
/*-------*/

/* project related routes */
app.use("/", homeRoute.router);
app.use("/login", loginRoute.router);
app.use("/register", registerRoute.router);
app.use("/reset", resetpasswordRoute.router);
app.use("/notice", noticeRouter.router);

/* admin route goes here */
app.use("/admin", adminRoute.router); // dashboard
app.use("/admin", alluniversity_under_adminRoute.router); // universities
app.use("/admin", articles_under_adminRoute.router); // articles

/* error handler */
app.use(NotFoundHandler);
app.use(errorHandler);

app.listen(port_number, () => {
  console.log(`Server is listening to ${port_number}`);
});
