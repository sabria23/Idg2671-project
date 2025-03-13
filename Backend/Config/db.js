import mongoose from "mongoose";

// Connect to Users Database
const connectToUsersDB = async () => {
    try {
        console.log('MONGO_URI1 from .env:', process.env.MONGO_URI1);
        const usersDB = mongoose.createConnection(process.env.MONGO_URI1);

        usersDB.on("connected", () => {
            console.log("MongoDB Connected to Users DB");
        });

        usersDB.on("error", (error) => {
            console.error("Error connecting to Users database:", error);
        });

        return usersDB; // Returning the connection object if needed elsewhere
    } catch (error) {
        console.error("Error connecting to Users database:", error);
        process.exit(1);
    }
};

// Connect to Studies Database
const connectToStudiesDB = async () => {
    try {
        console.log('MONGO_URI2 from .env:', process.env.MONGO_URI2);
        const studiesDB = mongoose.createConnection(process.env.MONGO_URI2);

        studiesDB.on("connected", () => {
            console.log("MongoDB Connected to Studies DB");
        });

        studiesDB.on("error", (error) => {
            console.error("Error connecting to Studies database:", error);
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
