import mongoose from "mongoose";
import WebhookEvent from "../models/WebhookEvent.js";
import Student from "../models/Student.js";
import generateInvoice from "../utils/invoiceGenerator.js";
import { emailQueue } from "../queues/emailQueue.js";
import logger from "../config/logger.js";

export const handleWebhook = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const event = JSON.parse(req.body.toString());
    const reference = event?.data?.reference;

    if (!reference) {
      logger.error("Webhook received without reference");
      await session.abortTransaction();
      return res.sendStatus(400);
    }

    // 🔐 Idempotency check
    const existingEvent = await WebhookEvent.findOne({
      reference,
      eventName: event.event
    }).session(session);

    if (existingEvent) {
      await session.abortTransaction();
      return res.sendStatus(200);
    }

    await WebhookEvent.create(
      [{
        reference,
        eventName: event.event
      }],
      { session }
    );

    if (event.event === "charge.success") {

      const student = await Student.findOne({
        paymentReference: reference
      }).session(session);

      if (!student) {
        logger.warn(`Student not found for reference ${reference}`);
        await session.abortTransaction();
        return res.sendStatus(200);
      }

      // 🛡️ Amount validation (Paystack sends kobo)
      if (student.amount * 100 !== event.data.amount) {
        logger.error(`Amount mismatch for ${reference}`);
        throw new Error("Amount mismatch");
      }

      // 🛡️ Currency validation
      if (event.data.currency !== "NGN") {
        logger.error(`Currency mismatch for ${reference}`);
        throw new Error("Currency mismatch");
      }

      // Prevent duplicate activation
      if (student.paymentStatus === "Paid") {
        await session.commitTransaction();
        return res.sendStatus(200);
      }

      // Update student
      student.paymentStatus = "Paid";
      student.accountStatus = "Active";
      student.activatedAt = new Date();

      await student.save({ session });

      await session.commitTransaction();

      logger.info(`Payment confirmed for ${student.studentId}`);

      // 🚀 Post-commit async tasks (NON-BLOCKING)

      const invoicePath = generateInvoice(student);

      await emailQueue.add("sendEmail", {
        to: student.email,
        subject: "Payment Confirmed - Bestolap Tuition",
        html: `
          <h2>Payment Successful 🎉</h2>
          <p>Student ID: <strong>${student.studentId}</strong></p>
          <p>Your account is now active.</p>
        `,
        attachment: invoicePath
      });

      await emailQueue.add("sendEmail", {
        to: process.env.ADMIN_EMAIL,
        subject: "New Payment Received",
        html: `
          <p>Student ID: ${student.studentId}</p>
          <p>Amount: ₦${student.amount.toLocaleString()}</p>
        `
      });

      return res.sendStatus(200);
    }

    await session.commitTransaction();
    return res.sendStatus(200);

  } catch (error) {
    await session.abortTransaction();
    logger.error("Atomic Webhook Error: " + error.message);
    return res.sendStatus(500);
  } finally {
    session.endSession();
  }
};
