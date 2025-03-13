import mongoose from "mongoose";

// Connect to Users Database
const connectToUsersDB = async () => {
    try {
        const usersDB = await mongoose.createConnection(process.env.MONGO_URI1).asPromise(); 
        console.log(`MongoDB Connected to Users DB: ${usersDB.host}`.cyan.underline);
        return usersDB; // Return the connection instance
    } catch (error) {
        console.error("Error connecting to Users database:", error);
        process.exit(1);
    }
};

// Connect to Studies Database
const connectToStudiesDB = async () => {
    try {
        const studiesDB = await mongoose.createConnection(process.env.MONGO_URI2);
        studiesDB.on("connected", () => {
            console.log(`MongoDB Connected to Studies DB: ${studiesDB.host}`.cyan.underline);
        });
        return studiesDB; // Returning the connection object if needed elsewhere
    } catch (error) {
        console.error("Error connecting to Studies database:", error);
        process.exit(1);
    }
};

// Function to connect both databases
export const connectToDatabases = async () => {
    await connectToUsersDB();
    await connectToStudiesDB();
};
