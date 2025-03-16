import mongoose from "mongoose";

const participantSchema = mongoose.Schema({
    study: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Study'
    },
    participantId: { //if lefti decides to invite people manually
        type: String, // Unique identifier for the participant not sure tho, this is suggestion from chatgpt
        required: true,
        unique: true
    },
    demographics: {
        age: Number,
        gender: String,
        location: String
    },

}, {
    collection: "participants"
})
const Participant = mongoose.model('Participant', participantSchema);
export default Participant;