const Razorpay = require("razorpay");
const config = require("../config/config");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");

const createOrder = async (req, res, next) => {
  const razorpay = new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpaySecretKey,
  });

  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(parseFloat(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Final amount in paise:", options.amount);

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    // Generate the expected signature
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpaySecretKey)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("Received Signature:", razorpay_signature);
    console.log("Expected Signature:", expectedSignature);

    // Compare signatures
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed!" });
    }

    res.json({ success: true, message: "Payment verified successfully!" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    next(error);
  }
};

const webHookVerification = async (req, res, next) => {
  try {
    const secret = config.razorpyWebhookSecret;
    const signature = req.headers["x-razorpay-signature"];

    const body = JSON.stringify(req.body);

    // 🛑 Verify the signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      console.log("✅ Webhook verified:", req.body);

      // ✅ Process payment (e.g., update DB, send confirmation email)
      if (req.body.event === "payment.captured") {
        const payment = req.body.payload.payment.entity;
        console.log(`💰 Payment Captured: ${payment.amount / 100} INR`);

        // Add Payment Details in Database
        const newPayment = new Payment({
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
          createdAt: new Date(payment.created_at * 1000),
        });

        await newPayment.save();
      }

      res.json({ success: true });
    } else {
      const error = createHttpError(400, "❌ Invalid Signature!");
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const savePaymentDetails = async (req, res, next) => {
  try {
    const {
      paymentId,
      orderId,
      amount,
      currency,
      status,
      method,
      email,
      contact,
      createdAt,
    } = req.body;

    // Create payment record
    const newPayment = new Payment({
      paymentId,
      orderId,
      amount,
      currency,
      status,
      method,
      email,
      contact,
      createdAt: new Date(createdAt),
    });

    await newPayment.save();
    res
      .status(200)
      .json({ success: true, message: "Payment details saved successfully" });
  } catch (error) {
    console.error("Error saving payment details:", error);
    next(error);
  }
};

// Add to module.exports
module.exports = {
  createOrder,
  verifyPayment,
  webHookVerification,
  savePaymentDetails,
};
