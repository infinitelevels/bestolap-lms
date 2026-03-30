import Student from "../models/Student.js";
import generateStudentId from "../utils/generateStudentId.js";
import calculateMonthlyFee from "../utils/pricingEngine.js";
import generateInvoice from "../utils/invoiceGenerator.js";
import initializePayment from "../utils/paystack.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { emailQueue } from "../queues/emailQueue.js";
import logger from "../config/logger.js";

export const enrollStudent = asyncHandler(async (req, res) => {
  const {
    parentName,
    studentName,
    email,
    phone,
    subjects,
    sessionType,
    duration,
    weeklyFrequency
  } = req.body;

  // Basic validation
  if (!subjects || subjects.length === 0) {
    return res.status(400).json({ message: "At least one subject required" });
  }

  const studentId = generateStudentId();

  const { monthlyHours, finalAmount } =
    calculateMonthlyFee(duration, weeklyFrequency, sessionType);

  // Initialize Paystack payment FIRST
  const paymentData = await initializePayment(
    email,
    finalAmount,
    studentId
  );

  if (!paymentData || !paymentData.authorization_url) {
    logger.error("Payment initialization failed");
    return res.status(500).json({ message: "Payment initialization failed" });
  }

  const student = await Student.create({
    studentId,
    parentName,
    studentName,
    email,
    phone,
    subjects,
    sessionType,
    duration,
    weeklyFrequency,
    monthlyHours,
    amount: finalAmount,
    paymentReference: paymentData.reference,
    paymentStatus: "pending"
  });

  const invoicePath = generateInvoice(student);

  // 📩 Queue student email
  await emailQueue.add("sendEmail", {
    to: student.email,
    subject: "Bestolap Tuition Invoice",
    html: `
      <h2>Welcome to Bestolap Tuition 🎓</h2>
      <p>Your Student ID: <strong>${student.studentId}</strong></p>
      <p>Monthly Tuition: ₦${student.amount.toLocaleString()}</p>
      <p>Please complete payment using the link below:</p>
      <a href="${paymentData.authorization_url}">Pay Now</a>
    `,
    attachment: invoicePath
  });

  // 📩 Queue admin notification
  await emailQueue.add("sendEmail", {
    to: process.env.ADMIN_EMAIL,
    subject: "New Student Enrollment",
    html: `
      <h3>New Enrollment Alert</h3>
      <p>Student ID: ${student.studentId}</p>
      <p>Parent: ${student.parentName}</p>
      <p>Amount: ₦${student.amount.toLocaleString()}</p>
    `
  });

  logger.info(`New student enrolled: ${student.studentId}`);

  res.status(201).json({
    studentId,
    paymentUrl: paymentData.authorization_url,
    amount: finalAmount,
    message: "Enrollment processed"
  });
});
