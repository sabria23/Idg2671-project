import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import userRouter from './Routes/userRoutes.js';
import studyRouter from './Routes/studyRoutes.js';
import surveyRouter from "./Routes/surveyRoute.js";
import connectToDB from "./Config/db.js";
import errorHandler from "./Middleware/errorHandler.js";
import cors from 'cors';


// Get the current directory of the ES module (server.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });
const port = process.env.PORT || 3000;
const app = express();

connectToDB();

app.use(express.json());
// in order to see request from the body we need this line (if using postman for example)
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3030',
    credentials: true //allows for setting up cookies
}));

// put your routes downbelow:
app.use('/api/auth', userRouter);
app.use('/api/studies', studyRouter);
app.use('/api/artifacts', studyRouter);
app.use('/api/survey', surveyRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`))

