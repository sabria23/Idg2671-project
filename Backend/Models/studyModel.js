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
  accessTokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: { // usefull for expiration policies
      type: Date,
      default: Date.now
    },
    active: { // Allows disabling specific links without removing them
      type: Boolean,
      default: true
    }
  }],
  published: { //status /draft, or published
    type: Boolean,
    default: false
  },
  questions: [
    {
      questionText: String,
      questionType: {
        type: String,
        enum: [
          'multiple-choice',
          'checkbox',
          'open-ended',
          'numeric-rating',
          'star-rating',
          'emoji-rating',
          'thumbs-up-down',
          'label-slider'
        ]
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
      layout: {
        type: String,
        enum: ['row', 'column', 'grid'],
        default: 'row'
      }
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model('Study', studySchema);