const express = require("express");
const router = express.Router();
const {
  addCoupon,
  applyCouponToTheOrder,
  getAllCoupons,
  deleteCoupon,
} = require('../controllers/couponControllers.js')
const {
    isAuthenticatedUser,
    authorizeRoles,
  } = require("../middlewares/userAuth");


router.route('/admin/coupon').post(isAuthenticatedUser,addCoupon).put(applyCouponToTheOrder).get(getAllCoupons)

router.route('/admin/coupon/:couponId').delete(deleteCoupon)
module.exports = router;
