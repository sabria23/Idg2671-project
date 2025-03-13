import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import router from './Routes/dashRoutes.js';
import {connectToDatabases} from "./Config/db.js";


dotenv.config();
// Get the current directory of the ES module (server.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });
const port = process.env.PORT || 3000;
const app = express();

connectToDatabases();

app.use(express.json());
// in order to see request from the body we need this line (if using postman for example)
app.use(express.urlencoded({extended: false}));
// use routes for dashboard
app.use('/api/dash-studies', router);


app.listen(port, () => console.log(`Server started on port ${port}`))

