import mongoose from 'mongoose';

const studySchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  published: { //status /draft, or published
    type: Boolean,
    default: false
  },
  questions: [
    {
      questionText: String,
      questionType: {
        type: String,
        enum: ['single', 'comparison']
      },
      fileContent: [ {
        fileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Artifact'
        },
        fileUrl: String,
        fileType: String
       }],
      options: [
        { 
          value: String, //custom message [option A, imaage 1 etc, yes, no]
          label: String //cusotm text set by the quiz creator, dipalyed to
        }
      ],
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model('Study', studySchema);