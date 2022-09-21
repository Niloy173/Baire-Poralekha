const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      data: Buffer,
      contentType: String,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    verified: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = new mongoose.model("Client", UserSchema);

module.exports = {
  UserModel,
};
