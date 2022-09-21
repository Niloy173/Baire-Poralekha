const express = require("express");
const bcypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  decorateHtmlResponse,
} = require("../middlewares/common/decorateHtmlResponse");

const {
  universityVerificationModel,
} = require("../model/universityVerificationSchema");

const { UserModel } = require("../model/UserSchema");
const { redirectLoggedIn } = require("../helpers/checker");

const router = express.Router();

router.get(
  "/",
  decorateHtmlResponse("Login"),
  redirectLoggedIn,
  (req, res, next) => {
    res.render("login");
  }
);

router.post("/", decorateHtmlResponse("Login"), (req, res, next) => {
  let { uemail, upassword } = req.body;

  if (uemail == "" || upassword == "") {
    res.render("login", {
      message: "Field is empty",
    });
  } else {
    UserModel.find({ email: uemail })
      .then((data) => {
        if (data.length > 0) {
          if (!data[0].verified) {
            res.render("login", {
              message: "Email hasn't been verified.",
            });
          } else {
            const hashedPassword = data[0].password;

            bcypt
              .compare(upassword, hashedPassword)
              .then((result) => {
                if (result) {
                  const token = jwt.sign(
                    {
                      useremail: data[0].email,
                      userid: data[0]._id,
                      role: data[0].role,
                    },
                    process.env.JWT_TOKEN,
                    {
                      expiresIn: process.env.JWT_EXPIRE,
                    }
                  );

                  res.cookie(process.env.COOKIE_NAME, token, {
                    expires: new Date(
                      Date.now() + parseInt(process.env.JWT_EXPIRE)
                    ),
                    httpOnly: true,
                    signed: true,
                  });

                  if (data[0].role === "user") {
                    res.redirect("/");
                  } else {
                    universityVerificationModel
                      .find({
                        OwnerId: data[0]._id,
                      })
                      .then((userdata) => {
                        if (userdata.length < 1) {
                          const createverificationIdentity =
                            new universityVerificationModel({
                              OwnerId: data[0]._id,
                            });

                          createverificationIdentity.save();
                        }
                      });
                    res.redirect("/admin/dashboard");
                  }
                } else {
                  res.render("login", {
                    message: "password is incorrect!",
                  });
                }
              })
              .catch((error) => {
                res.render("login", {
                  message: "An error occured while comparing password",
                });
              });
          }
        } else {
          res.render("login", {
            message: "Invalid credentials entered!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.render("login", {
          message: "An error occured while checking for exisiting user",
        });
      });
  }
});

module.exports = {
  router,
};
