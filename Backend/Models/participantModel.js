import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  studyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Study', 
    required: true
  },
  invitationId: { //referencing those that participate via email invite
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyInvitation',
    default: null
   },
  deviceInfo: String,
  sessionToken: {
    type: String,
    required: true,
    unique: true
  },
  demographics: { // either have this approach or have type: Map, of: string 
    age: {
      type: Number,
      min: 0,
      max: 116,
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'prefer_not_to_say']
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  responses: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Study.questions'
      },
      participantAnswer: mongoose.Schema.Types.Mixed, // Allow different answer types
      answerType: {
        type: String,
        enum: ['text', 'numeric', 'selection'],
        required: true
      },
      skipped: {
        type: Boolean,
        default: false
      }
    }],
}, {
  timestamps: true
});

export default mongoose.model('Session', sessionSchema);