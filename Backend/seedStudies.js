// seedStudies.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Study from './Models/studyModel.js';
import crypto from 'crypto';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check if MONGO_URI exists
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI not found in environment variables');
  console.log('Please make sure your .env file contains MONGO_URI=your_connection_string');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully for seeding');
    createDummyStudies();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create dummy studies
const createDummyStudies = async () => {
  try {
    console.log('Starting to create dummy studies...');
    
    // Create dummy user ID (since auth isn't fully implemented yet)
    const dummyUserId = new mongoose.Types.ObjectId();
    console.log('Using dummy user ID:', dummyUserId.toString());
    
    // Dummy artifact IDs for file references
    const dummyArtifactId1 = new mongoose.Types.ObjectId();
    const dummyArtifactId2 = new mongoose.Types.ObjectId();
    
    // Insert dummy studies
    const studies = await Study.create([
      {
        creator: dummyUserId,
        title: "User Experience Survey",
        description: "A study about user experience with our new mobile app",
        published: true,
        questions: [
          {
            questionText: "How would you rate the ease of navigation?",
            questionType: "single",
            options: [
              { value: "1", label: "Very difficult" },
              { value: "2", label: "Difficult" },
              { value: "3", label: "Neutral" },
              { value: "4", label: "Easy" },
              { value: "5", label: "Very easy" }
            ]
          },
          {
            questionText: "Which interface do you prefer?",
            questionType: "comparison",
            fileContent: [
              {
                fileId: dummyArtifactId1,
                fileUrl: "https://example.com/interface1.jpg",
                fileType: "image/jpeg"
              },
              {
                fileId: dummyArtifactId2,
                fileUrl: "https://example.com/interface2.jpg",
                fileType: "image/jpeg"
              }
            ],
            options: [
              { value: "interface1", label: "Interface A" },
              { value: "interface2", label: "Interface B" }
            ]
          }
        ]
      },
      {
        creator: dummyUserId,
        title: "Product Feedback",
        description: "Help us improve our product by providing feedback",
        published: false,
        questions: [
          {
            questionText: "What features would you like to see added?",
            questionType: "single",
            options: [
              { value: "feature1", label: "Better search" },
              { value: "feature2", label: "Dark mode" },
              { value: "feature3", label: "Offline support" }
            ]
          }
        ]
      },
      {
        creator: dummyUserId,
        title: "Empty Study",
        description: "A study with no questions yet",
        published: false,
        questions: []
      }
    ]);
    
    console.log('Dummy studies created:', studies.length);
    console.log('Study IDs to use in testing:');
    studies.forEach(study => {
      console.log(`"${study.title}": ${study._id.toString()}`);
    });
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};