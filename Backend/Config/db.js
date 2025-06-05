import mongoose from "mongoose";

// Enable Mongoose debug mode to log all MongoDB queries to the console
mongoose.set('debug', true);

// Connect to  Database
const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); 
        console.log(process.env.MONGO_URI);  // Check if the URI is correct

        return conn; // Return the connection instance
    } catch (error) {
        console.error("Error connecting to main database:", error);
        process.exit(1);
    }
};


// Function to connect both databases
export default connectToDB;
