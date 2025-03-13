import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


const mongoUri = process.env.MONGO_URI;
console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to the 'Users' database and the 'Studies-and-participants' database using mongoose.connect
export const connectToDatabases = async () => {
    try {
        // Connect to the 'Users' database
        await mongoose.connect(`${mongoUri}/Users`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected to Users DB`);

        // Now connect to the 'Studies-and-participants' database
        await mongoose.connect(`${mongoUri}/Studies-and-participants`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected to Studies DB`);
    } catch (error) {
        console.error('Error connecting to the databases:', error);
        process.exit(1);
    }
};