import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
dotenv.config();

// Get the current directory of the ES module (server.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const port = process.env.PORT || 3000;
const app = express();


app.listen(port, () => console.log(`Server started on port ${port}`))

