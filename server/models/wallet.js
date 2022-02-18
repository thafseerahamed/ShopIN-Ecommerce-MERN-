const mongoose = require("mongoose");


const wallet = mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true,
      },
      balance: {
        type: Number,
        required: true,
        default: 0.0,
      },
    },
    {
      timestamps: true,
    }
  )

  module.exports = mongoose.model("Wallet", wallet);