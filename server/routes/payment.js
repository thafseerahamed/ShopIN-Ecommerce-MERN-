const express = require("express");
const router = express.Router();

const {
 processPayment, sendStripeApi, razorpayPayment
} = require("../controllers/paymentController");

const {
  isAuthenticatedUser
  
} = require("../middlewares/userAuth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, sendStripeApi);
router.route("/razorpay").post(isAuthenticatedUser,razorpayPayment)

module.exports = router;
