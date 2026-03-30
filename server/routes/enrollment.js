import express from "express";
import crypto from "crypto";
import Student from "../models/Student.js";
import { enrollStudent } from "../controllers/enrollmentController.js";
import generateInvoice from "../utils/invoiceGenerator.js";
import sendEmail from "../utils/emailService.js";
import WebhookEvent from "../models/WebhookEvent.js";

const router = express.Router();

/* ===============================
   STUDENT ENROLLMENT ROUTE
================================= */

router.post("/enroll", enrollStudent);


/* ===============================
   PAYSTACK WEBHOOK
================================= */

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(req.body instanceof Buffer ? req.body : Buffer.from(req.body))
        .digest("hex");

      if (hash !== req.headers["x-paystack-signature"]) {
        return res.sendStatus(401);
      }

      const event = JSON.parse(req.body.toString());

      const eventId = event.id; // Paystack event unique ID

      // Check duplicate webhook event
      const existingEvent = await WebhookEvent.findOne({
        eventName: event.event,
        reference: event.data.reference             
      });

      if (existingEvent) {
        console.log("⚠ Duplicate webhook ignored");
        return res.sendStatus(200);
      }

      // Save event immediately (lock event processing)
      await WebhookEvent.create({
        eventId,
        eventName: event.event,
        reference: event.data.reference
      });

      if (event.event === "charge.success") {
        const reference = event.data.reference;

        const student = await Student.findOneAndUpdate(
          { paymentReference: reference },
          { paymentStatus: "Paid" },
          { new: true }
        );

        if (!student) return res.sendStatus(404);

        // Generate invoice after payment confirmation
        const invoicePath = generateInvoice(student);

        // Send payment confirmation email
        await sendEmail(
          student.email,
          "Payment Confirmed - Bestolap Tuition",
          `
          <h2>Payment Successful 🎉</h2>
          <p>Student ID: <strong>${student.studentId}</strong></p>
          <p>Amount Paid: ₦${student.amount.toLocaleString()}</p>
          <p>Your classes will begin shortly.</p>
          `,
          invoicePath
        );

        // Notify admin
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "New Payment Received",
          `
          <h3>Payment Alert</h3>
          <p>Student ID: ${student.studentId}</p>
          <p>Parent: ${student.parentName}</p>
          <p>Amount: ₦${student.amount.toLocaleString()}</p>
          `
        );
      }

      res.sendStatus(200);

    } catch (error) {
      console.error("Webhook Error:", error);
      res.sendStatus(500);
    }
  }
);


/* ===============================
   OPTIONAL DIRECT REGISTER ROUTE
================================= */

router.post("/register", async (req, res) => {
  try {
    const {
      studentfirstName,
      studentlastName,
      subjects,
      ...rest
    } = req.body;

    const newStudent = new Student({
      studentName: {
        firstName: studentfirstName.trim(),
        lastName: studentlastName.trim()
      },
      subjects: typeof subjects === "string"
        ? JSON.parse(subjects)
        : subjects,
        ...rest
    });

    await newStudent.save();

    res.redirect("/success");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

export default router;
