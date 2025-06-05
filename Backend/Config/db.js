import mongoose from "mongoose";
// enable Mongoose debug mode to log all MongoDB queries to the console
mongoose.set('debug', true);

const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); 
        console.log(process.env.MONGO_URI);  // Check if the URI is correct

        return conn; 
    } catch (error) {
        console.error("Error connecting to main database:", error);
        process.exit(1);
    }
};

export default connectToDB;
