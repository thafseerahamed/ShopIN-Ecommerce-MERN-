const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const Coupon = require("../models/coupon");
const Order = require("../models/order");

// @desc Add a new coupon
// @route POST /api/coupon
// @access Private/Admin
exports.addCoupon = catchAsyncErrors(async (req, res) => {
  const { name, discount } = req.body
  const newCoupon = new Coupon({
    name,
    discount,
  })

  // return res.json(newCoupon)
  const savedCoupon = await newCoupon.save()
  res.json(savedCoupon)
})

// @desc Apply coupon to an order and update the users array in the Coupon collection
// @route PUT /api/coupon
// @access Public
exports.applyCouponToTheOrder = catchAsyncErrors(async (req, res) => {
  const { couponId, user } = req.body
  const coupon = await Coupon.findById(couponId)
  let updatedCoupon
  if (coupon) {
    if (coupon.users.includes(user)) {
      res.json({
        error: 'You have already used this coupon',
      })
    } else {
      coupon.users.push(user)
      updatedCoupon = await coupon.save()
      res.json(updatedCoupon)
    }
  } else {
    res.json('Coupon does not exist')
  }
})

// @desc Get the list of all coupons
// @route GET /api/coupon
// @access Public
exports.getAllCoupons = catchAsyncErrors(async (req, res) => {
  const coupons = await Coupon.find({})
  res.json(coupons)
})

// @desc Delete a coupon
// @route DELETE /api/coupon
// @access Private/Admin
exports.deleteCoupon = catchAsyncErrors(async (req, res) => {
  const couponId = req.params.couponId
  const coupon = await Coupon.deleteOne({ _id: couponId })
  if (coupon) {
    res.json('Coupon deleted successfully')
  } else {
    res.json('Coupon does not exist')
  }
})


