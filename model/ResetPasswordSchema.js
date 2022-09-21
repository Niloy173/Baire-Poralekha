const mongoose = require("mongoose");

const ResetPasswordSchema = new mongoose.Schema({
  userId: String,
  resetString: String,
  createdAt: Date,
  expiresAt: Date,
});

const ResetPassword = new mongoose.model("Resetpassword", ResetPasswordSchema);

module.exports = {
  ResetPassword,
};
