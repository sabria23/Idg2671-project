import mongoose from 'mongoose';

const artifactSchema = new mongoose.Schema({
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fileName: String,
    fileType: {
      type: String,
      enum: ['image', 'video', 'audio', 'text'],
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    usedInStudies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Study'
    }],
  });
  
  export default mongoose.model('Artifact', artifactSchema);