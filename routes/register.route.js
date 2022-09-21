const express = require("express");
const fs = require("fs");
const path = require("path");
const url = require("url");

const {
  decorateHtmlResponse,
} = require("../middlewares/common/decorateHtmlResponse");

const { UserModel } = require("../model/UserSchema");

const { UserVerificationModel } = require("../model/UserVerificationSchma");

const { transporter } = require("../helpers/nodemailer_transporter");

const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require("uuid");

const { redirectLoggedIn } = require("../helpers/checker");

const router = express.Router();

router.get(
  "/",
  decorateHtmlResponse("Register"),
  redirectLoggedIn,
  (req, res, next) => {
    res.render("register");
  }
);

router.get("/verified", (req, res) => {
  res.sendFile(
    path.join(__dirname + "./../template/views/message/confirmation.html")
  );
});

router.get("/verify/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;

  UserVerificationModel.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hasheduniqueString = result[0].uniqueString;

        //check for expired time
        if (expiresAt < Date.now()) {
          // record already expired
          UserVerificationModel.deleteOne({ userId })
            .then((result) => {
              // delete the co-responding user data
              UserModel.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has been expired. Please sign up again. ";
                  // res.redirect(`/register/verified/error=true&message=${message}`);
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
                  let message =
                    "Clearing user with expired unique string failed";
                  res.json({
                    message,
                  });
                });
            })
            .catch((error) => {
              let message =
                "An error occured while clearing expired user verification record";
              // res.redirect(
              //   url.format({
              //     pathname: "/register/verified/",
              //     query: {
              //       error: true,
              //       message: message,
              //     },
              //   })
              // );

              res.json({
                message,
              });
            });
        } else {
          bcrypt
            .compare(uniqueString, hasheduniqueString)
            .then((result) => {
              if (result) {
                UserModel.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerificationModel.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(
                          path.join(
                            __dirname,
                            "./../template/views/message/confirmation.html"
                          )
                        );
                      })
                      .catch((error) => {
                        let message =
                          "An error occured while finalizing succssful verification.";
                        res.json({
                          message,
                        });
                      });
                  })
                  .catch((error) => {
                    let message =
                      "An error occured while updating the user record";

                    res.json({
                      message,
                    });
                  });
              } else {
                let message =
                  "Invalid verification details passed. Check your inbox.";
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
              let message = "An error occured while comparing unique strings";
              res.json({
                message,
              });
            });
        }
      } else {
        let message = encodeURIComponent(
          "Account record doesn't exist or has been verified already. Please sign up or log in. "
        );

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
      let message =
        "An error occured while checkig for existing user verification record";

      res.json({
        message,
      });
    });
});

router.post("/", decorateHtmlResponse("Register"), async (req, res, next) => {
  let { uname, uemail, upassword } = req.body;

  if (uname == "" || uemail == "" || upassword == "") {
    res.render("register", {
      message: "Field is empty",
    });
  } else if (uname.length < 3) {
    res.render("register", {
      message: "name is too small",
    });
  } else if (upassword.length < 8) {
    res.render("register", {
      message: "please provide at least 8 character password",
    });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(upassword, 10);

      // check if any user exists with the current email
      const SingleUser = await UserModel.findOne({ email: uemail });

      if (SingleUser) {
        res.render("register", {
          message: `User already exists.please check your email for verify`,
        });
      } else {
        // create new user
        const newUser = new UserModel({
          fullname: uname,
          email: uemail,
          password: hashedPassword,
          verified: false,
          profileImage: {
            data: fs.readFileSync(
              path.join(__dirname + "/../public/images/nophoto.png")
            ),
            contentType: "png",
          },
        });

        const result = await newUser.save();

        // send the mail
        sendVerificationEmail(result, res);
      }
    } catch (error) {
      console.log(error.message);
      res.render("register", {
        message: "unexpected error occured",
      });
    }
  }
});

const sendVerificationEmail = ({ _id, email }, res) => {
  const currentUrl = `${process.env.APP_URL}`;

  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email Address",
    html: `<h2> Welcome to Baire PoraLekha </h2>
    <p> verify your email address to complete the signup and login into your account</p>  
    <p> This link expires in <b>1 hour </b></p>
    <p> <a href=${
      currentUrl + "register/verify/" + _id + "/" + uniqueString
    }> click here </a> to proceed </p>`,
  };

  bcrypt
    .hash(uniqueString, 10)
    .then((hashedString) => {
      const newVerification = new UserVerificationModel({
        userId: _id,
        uniqueString: hashedString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              // mail send successfully
              res.sendFile(
                path.join(
                  __dirname + "./../template/views/message/ImportantMsg.html"
                )
              );

              console.log(`Email send to ${email}`);
            })
            .catch((error) => {
              let message =
                "Verification email failed! Please try again later.";

              res.redirect(
                url.format({
                  pathname: "/register/verified",
                  query: {
                    error: true,
                    message: message,
                  },
                })
              );
            });
        })
        .catch(() => {
          res.json({
            message:
              "An error occured while saving verification email data! Please try again later.",
          });
        });
    })
    .catch(() => {
      res.json({
        message:
          "An error occured while hashing email data! Please try again later.",
      });
    });
};

module.exports = {
  router,
};
