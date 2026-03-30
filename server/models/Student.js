import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

  studentId: { 
    type: String, 
    unique: true 
  },

  studentName: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    }
  },

  dateOfBirth: Date,

  gender: String,
  gradeLevel: String,
  currentSchool: String,

  parentName: {
    type: String,
    required: true,
    trim: true
  },

  relationship: String,

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    trim: true
  },

  country: String,
  state: String,

  subjects: {
    type: [String],
    required: true
  },

  supportAreas: String,
  academicPerformance: String,
  sessionType: String,

  duration: Number,
  weeklyFrequency: Number,
  monthlyHours: Number,

  amount: {
    type: Number,
    required: true
  },

  paymentReference: {
    type: String,
    index: true
  },

  paymentLink: String,

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },

  accountStatus: {
    type: String,
    enum: ["Inactive", "Active"],
    default: "Inactive"
  },

  activatedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true }); // optional but recommended


export default mongoose.model("Student", studentSchema);
