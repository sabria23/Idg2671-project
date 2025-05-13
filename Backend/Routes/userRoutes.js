import express from "express"; 
import {userController} from "../Controllers/userController.js";
import upload from "../Middleware/fileUploads.js";
import protect from "../Middleware/authMiddleware.js";
import { validate } from "uuid";
import { 
  validateUserRegistration,
  validatePicture 
} from "../Validators/userValidators.js";

const userRouter = express.Router();

userRouter.post("/register", validateUserRegistration, userController.createUser);
userRouter.post("/login", userController.authenticateLogin);
userRouter.get("/user", protect, userController.getUser);
userRouter.post("/logout", userController.authenticateLogout);

// userRouter.post("/profile", protect, upload.single("avatar"), userController.updateUserProfile);
userRouter.put("/update-profile", protect, upload.single("avatar"), validatePicture, userController.updateUserProfile);
userRouter.delete("/profile", protect, userController.deleteUser);

export default userRouter;