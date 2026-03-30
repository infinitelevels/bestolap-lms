import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function generateInvoice(student) {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const invoiceDir = path.join(__dirname, "../invoices");

  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir, { recursive: true });
  }

  const filePath = path.join(invoiceDir, `${student.studentId}.pdf`);

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Bestolap Tuition Invoice", { align: "center" });
  doc.moveDown();

  doc.text(`Invoice ID: ${student.studentId}`);
  doc.text(`Parent Name: ${student.parentName}`);

  doc.text(
    `Child Name: ${student.studentName.firstName} ${student.studentName.lastName}`
  );

  doc.text(`Subjects: ${student.subjects.join(", ")}`);
  doc.text(`Session Type: ${student.sessionType}`);
  doc.text(`Monthly Hours: ${student.monthlyHours}`);
  doc.text(`Amount: ₦${student.amount.toLocaleString()}`);
  doc.text(`Status: ${student.paymentStatus}`);

  doc.moveDown();

  doc.text("Bank: Paystack Secure Payment");
  doc.text("Thank you for choosing Bestolap Tuition.");

  doc.end();

  return filePath;
}

export default generateInvoice;
