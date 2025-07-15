const express = require("express");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { createOrder, verifyPayment, webHookVerification, savePaymentDetails } = require("../controllers/paymentController");
 
router.route("/create-order").post(isVerifiedUser , createOrder);
router.route("/verify-payment").post(isVerifiedUser , verifyPayment);
router.route("/webhook-verification").post(webHookVerification);
router.route("/save-details").post(isVerifiedUser, savePaymentDetails);

module.exports = router;