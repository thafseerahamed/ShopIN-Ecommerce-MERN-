const mongoose = require('mongoose')
const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Offer", offerSchema);