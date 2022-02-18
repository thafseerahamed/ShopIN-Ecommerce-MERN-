const mongoose = require("mongoose");

const referralId = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    referralId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)


module.exports = mongoose.model("ReferralId", referralId);