import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import userRouter from './Routes/userRoutes.js';
import studyRouter from './Routes/studyRoutes.js';
import artifactRouter from "./Routes/artifactRouter.js";
import surveyRouter from "./Routes/surveyRoute.js";
import connectToDB from "./Config/db.js";
import errorHandler from "./Middleware/errorHandler.js";
import cors from 'cors';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const port = process.env.PORT || 3000;

connectToDB();

const allowedOrigins = [
  'http://localhost:3030',
  'https://group4.sustainability.it.ntnu.no'
];
app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS request from origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRouter);
app.use('/api/studies', studyRouter);
app.use('/api/artifacts', artifactRouter);
app.use('/api/survey', surveyRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

export { app };
