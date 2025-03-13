// here you define the shcema for user-admin
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    "username": { 
        type: String,
        required: [true, 'Please create a username']
    },
    "name": { 
        type: String,
        required: [true, 'Please enter a name']
    },
    "email": { 
        type: String,
        required: [true, 'Please enter an email'],
        unique: true
    },
    "password": { 
        type: String,
        required: [true, 'Please add a password']
    },
},
//timestamps gives autimatically info about when the account was created and udpated
{
    timestamps: true
})

//model name is User
export default mongoose.model('User', userSchema);