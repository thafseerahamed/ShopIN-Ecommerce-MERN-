const express = require("express");
const router = express.Router();

const {
 processPayment, sendStripeApi, razorpayPayment,updatePayment
} = require("../controllers/paymentController");

const {
  isAuthenticatedUser,authorizeRoles
  
} = require("../middlewares/userAuth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, sendStripeApi);
router.route("/razorpay").post(isAuthenticatedUser,razorpayPayment)
router.route("/admin/payment/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updatePayment)
module.exports = router;
