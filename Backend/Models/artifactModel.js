import mongoose from 'mongoose';

const artifactSchema = new mongoose.Schema({
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fileName: String,
    fileType: {
      type: String,
      enum: ['image', 'video', 'audio', 'text', 'other'],
      required: true
    },
    fileData: {
      type: Buffer,
      required: true
    },
    usedInStudies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Study'
    }],
  });
  
  export default mongoose.model('Artifact', artifactSchema);