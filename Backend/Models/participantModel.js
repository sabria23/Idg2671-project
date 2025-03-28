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
  demographics: { // either have this approach or have type: Map, of: string 
    age: {
      type: String,
      enum: [ 'under 18', '18-25', '25-35', '35-45', '45-55', '55-65', '65+' ] 
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
        enum: ['text', 'ranking', 'numeric', 'selection'],
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