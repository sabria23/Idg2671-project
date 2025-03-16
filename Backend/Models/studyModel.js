import mongoose  from "mongoose";

const artifactSchema = new mongoose.Schema({
    name: String,
    fileType: String, //video, image, audio, text
    filePath: String // path to the file in the filesystem
});

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['comparison', 'rating', 'multiple-choice', 'open-ended'],
        required: true
    },
    artifacts: [artifactSchema], // uses the seperate artifactsSchema
    options: [String], //for multiple choce question (i think)
    /* required: {
        type: Boolean,
        default: true
    }*/
});

const studySchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', //reference to the model in userModel.js
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed'],
        default: 'draft'
    },
    questions: [questionSchema],
    participationLink: { // participationLink is declared here because this field stores a unique link that participants can use to acces the study
        type: String,
        unique: true,
        sparse: true // allows null values
    },
    participantCount: { // tracks who has accessed or completed the study
        type: Number,
        default: 0
    }
}, {
    collection: "studies"
});

const Study = mongoose.model('Study', studySchema);

export default Study;