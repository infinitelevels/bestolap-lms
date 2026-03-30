import mongoose from "mongoose";

const TutorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  country: String,
  state: String,

  britishExperience: String,
  americanExperience: String,
  pcRequirement: String,
  internetRequirement: String,
  troubleshooting: String,

  digitalPen: String,
  oneDriveSkill: String,
  oneNoteSkill: String,
  formsSkill: String,
  teamsSkill: String,

  yearsExperience: Number,
  classes: [String],
  subjects: [String],

  demoVideo: String,
  documents: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TutorApplication = mongoose.model("TutorApplication", TutorSchema);

export default TutorApplication;