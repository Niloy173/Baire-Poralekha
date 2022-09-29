const { UserModel } = require("../model/UserSchema");
const createError = require("http-errors");

const GetProfileAvatar = async (req, res, next) => {
  try {
    if (Object.keys(res.locals.userInformation).length != 0) {
      const CurrentUser = await UserModel.findOne({ _id: req.user.userid });

      res.locals.profileImage = CurrentUser.profileImage;
     res.locals.username = CurrentUser.fullname;

      next();
    } else {
      next();
    }
  } catch (error) {
    throw createError(error);
  }
};

module.exports = {
  GetProfileAvatar,
};
