const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema({
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
});

const UserVerificationModel = new mongoose.model(
  "Userverification",
  UserVerificationSchema
);

module.exports = {
  UserVerificationModel,
};
