import crypto from "crypto";

const verifyPaystack = (req, res, next) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.body)
    .digest("hex");

  if (hash === req.headers["x-paystack-signature"]) {
    next();
  } else {
    return res.status(401).json({ message: "Invalid Paystack signature" });
  }
};

export default verifyPaystack;
