const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const url = require("url");
const {
  decorateHtmlResponse,
} = require("../middlewares/common/decorateHtmlResponse");

const { UserModel } = require("../model/UserSchema");
const { ResetPassword } = require("../model/ResetPasswordSchema");
const { transporter } = require("../helpers/nodemailer_transporter");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", decorateHtmlResponse("Forget Password"), (req, res) => {
  res.render("resetPassword");
});

router.get("/reset/:userId/:resetString", (req, res) => {
  let { userId, resetString } = req.params;

  ResetPassword.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];

        if (expiresAt < Date.now()) {
          ResetPassword.deleteOne({ userId })
            .then(() => {
              const message = "password reset link has been expired";
              res.redirect(
                url.format({
                  pathname: "/register/verified/",
                  query: {
                    error: true,
                    message: message,
                  },
                })
              );
            })
            .catch((error) => {
              res.json({
                message: "Deleting password reset record failed",
              });
            });
        } else {
          res.render("confirmresetpassword");
        }
      } else {
        const message =
          "Password already reset recently.please try again later or send another request from forget password";

        res.redirect(
          url.format({
            pathname: "/register/verified/",
            query: {
              error: true,
              message: message,
            },
          })
        );
      }
    })
    .catch((error) => {
      res.json({
        message: "Error occured while finding reset record from database",
      });
    });
});

router.post("/reset/:userId/:resetString", (req, res) => {
  let { upassword, ucpassword } = req.body;
  let { userId, resetString } = req.params;

  if (upassword != ucpassword) {
    res.render("confirmresetpassword", {
      message: "Password didn't match",
    });
  } else if (ucpassword.length < 8) {
    res.render("confirmresetpassword", {
      message: "Password should contain at least 8 character",
    });
  } else {
    ResetPassword.find({ userId })
      .then((result) => {
        if (result.length > 0) {
          const hashedResetString = result[0].resetString;

          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              if (result) {
                bcrypt
                  .hash(upassword, 10)
                  .then((hashedNewPassword) => {
                    UserModel.updateOne(
                      { _id: userId },
                      { password: hashedNewPassword }
                    )
                      .then(() => {
                        ResetPassword.deleteOne({ userId })
                          .then(() => {
                            console.log("Successfully reset the password");
                            res.redirect("/login");
                          })
                          .catch((error) => {
                            res.json({
                              message: "Removing record faied to delete",
                            });
                          });
                      })
                      .catch((error) => {
                        const message = "Updating user password failed";

                        res.redirect(
                          url.format({
                            pathname: "/register/verified/",
                            query: {
                              error: true,
                              message: message,
                            },
                          })
                        );
                      });
                  })
                  .catch((error) => {
                    res.json({
                      message: "An error occured while hashing the password",
                    });
                  });
              } else {
                const message = "Password already reset recently";

                res.redirect(
                  url.format({
                    pathname: "/register/verified/",
                    query: {
                      error: true,
                      message: message,
                    },
                  })
                );
              }
            })
            .catch((error) => {
              // console.log(error);
              res.json({
                message: "Comparing password reset strings failed",
              });
            });
        } else {
          res.json({
            message: "Password already reset recently.please try again later",
          });
        }
      })
      .catch((error) => {
        res.json({
          message:
            "Checking for existing password reset record failed Due to some error",
        });
      });
  }
});

// handling the email sending request
router.post("/", decorateHtmlResponse("Forget Password"), (req, res) => {
  let { uemail } = req.body;

  if (uemail == "") {
    res.render("resetPassword", {
      message: "Field is empty",
    });
  } else {
    UserModel.find({ email: uemail })
      .then((data) => {
        if (data.length > 0) {
          if (!data[0].verified) {
            res.render("resetPassword", {
              message: "Email hasn't been verified yet. Check your inbox",
            });
          } else {
            sendResetEmail(data[0], res);
          }
        } else {
          res.render("resetPassword", {
            message: `No account found with ${uemail}`,
          });
        }
      })
      .catch((error) => {
        res.render("resetPassword", {
          message: "An error occured while checking the existing user",
        });
      });
  }
});

const sendResetEmail = ({ _id, email }, res) => {
  const redirectUrl = `${process.env.APP_URL}`;

  const resetString = uuidv4() + _id;

  ResetPassword.deleteMany({ userId: _id })
    .then((result) => {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Password Reset",
        html: `<h2> Welcome to Baire PoraLekha </h2>
                        <p> Have you lost your password! Don't worry just click the link below to reset.</p>  
                        <p> This link <b>expires in 10 minute</b>.</p>
                        <p> <a href=${
                          redirectUrl +
                          "resetpassword/reset/" +
                          _id +
                          "/" +
                          resetString
                        }> click here </a> to proceed </p>`,
      };

      bcrypt
        .hash(resetString, 10)
        .then((hashedResetString) => {
          const newPasswordReset = new ResetPassword({
            userId: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 60000,
          });

          newPasswordReset
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  console.log(`Reset Email send to ${email}`);
                  res.sendFile(
                    path.join(
                      __dirname,
                      "./../template/views/message/ImportantMsg.html"
                    )
                  );
                })
                .catch((error) => {
                  // console.log(error);
                  res.render("resetPassword", {
                    message: "Password reset email Failed",
                  });
                });
            })
            .catch((error) => {
              // console.log(error);
              res.render("resetPassword", {
                message:
                  "An error occured while saving the password reset data",
              });
            });
        })
        .catch((error) => {
          // console.log(error);
          res.render("resetPassword", {
            message: "An error occured while hashing the password",
          });
        });
    })
    .catch((error) => {
      // console.log(error);
      res.render("resetPassword", {
        message: "An error occured clearing reset records failed",
      });
    });
};

module.exports = {
  router,
};
