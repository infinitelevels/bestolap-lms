import Tutor from "../models/TutorApplication.js";
import multer from "multer";

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "demoVideo") {
      cb(null, "uploads/videos");
    } else {
      cb(null, "uploads/documents");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File Upload Configuration
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "documents" && file.mimetype !== "application/pdf") {
      return cb(new Error("PDF only"));
    }

    if (file.fieldname === "demoVideo" && file.mimetype !== "video/mp4") {
      return cb(new Error("MP4 only"));
    }

    cb(null, true);
  },
});

// Middleware Export
export const uploadMiddleware = upload.fields([
  { name: "demoVideo", maxCount: 1 },
  { name: "documents", maxCount: 1 },
]);

// Controller Function
export const applyTutor = async (req, res) => {
  try {
    const tutor = new Tutor({
      ...req.body,
      classes: req.body.classes,
      subjects: req.body.subjects,
      demoVideo: req.files?.demoVideo?.[0]?.path,
      documents: req.files?.documents?.[0]?.path,
    });

    await tutor.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};