import mongoose from "mongoose";
const studyInvitationSchema = new mongoose.Schema({
  studyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Study',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emails: [String], // Simple array of email addresses
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  successCount: {
    type: Number,
    default: 0
  },
  failCount: {
    type: Number,
    default: 0
  },
  invitationToken: {
    type: String,
    unique: true
  },
  sentAt: Date
}, { timestamps: true });
  
  export default mongoose.model('StudyInvitation', studyInvitationSchema);