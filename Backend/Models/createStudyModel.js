import mongoose  from "mongoose";

const createStudy = mongoose.Schema({
    "user": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', //reference to the model in userModel.js
    },
    "title": {
        String,
        required: true,
    },
    "description": {
        String,
        required: true
    },
    "questions": {
        String
        /*embedded: //artifacts [

        ]*/
    }
});
