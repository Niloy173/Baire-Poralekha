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
const adminRoute = require("./routes/adminRoute/admin.route");

/* middleware */
app.enable("case sensitive routing");
app.use(express.static(staticPath));
app.use("/article", express.static(`${__dirname}` + "/public/article/"));
app.use("/css", express.static(`${__dirname}` + "/public/css/"));
app.use("/img", express.static(`${__dirname}` + "/public/images/"));
app.use("/js", express.static(`${__dirname}` + "/public/script/"));
/*---------------*/

/* view emgine set up */
app.set("view engine", "ejs");
app.set("views", templatePath);
/*-------*/

/* project related routes */

/* admin route goes here */
app.use("/admin", adminRoute.router);

/* error handler */
app.use(NotFoundHandler);
app.use(errorHandler);

app.listen(port_number, () => {
  console.log(`Server is listening to ${port_number}`);
});
