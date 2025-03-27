import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dashRouter from './Routes/dashRoutes.js';
import userRouter from './Routes/userRoutes.js';
import studyRouter from './Routes/studyRoutes.js';
import connectToDB from "./Config/db.js";
import errorHandler from "./Middleware/errorHandler.js";

// Get the current directory of the ES module (server.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });
const port = process.env.PORT || 3000;
const app = express();

connectToDB();

app.use(express.json());
// in order to see request from the body we need this line (if using postman for example)
app.use(express.urlencoded({extended: false}));

// put your routes downbelow:
app.use('/api/studies', dashRouter);
app.use('/api/auth', userRouter);
app.use('/api/studies', studyRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`))

