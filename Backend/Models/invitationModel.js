const studyInvitationSchema = new mongoose.Schema({
    studyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Study',
      required: true
    },
    email: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'completed', 'expired'],
      default: 'pending'
    },
    invitationToken: {
        type: string,
        required: true,
        unique: true
    },
    sentAt: Date,
    completedAt: Date
  }, { timestamps: true });
  
  export default mongoose.model('StudyInvitation', studyInvitationSchema);