import express from "express";
import {userController} from "../Controllers/userController.js";
const userRouter = express.Router();

userRouter.post("/register", userController.createUser) 
userRouter.post("/login", userController.authenticateLogin)
userRouter.post("/logout", userController.authenticateLogout);
userRouter.get("/user", userController.getUser);
userRouter.post("/forgot-password")
userRouter.post("/reset-apssword")


export default userRouter;