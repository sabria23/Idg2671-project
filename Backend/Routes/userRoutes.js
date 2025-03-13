import express from "express";
import { registerUser, loginUser, getMe } from "../Controllers/userController.js";

const userRouter = express.Router();

//controller function is called; registerUser
userRouter.post('/', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', getMe);


export default userRouter;