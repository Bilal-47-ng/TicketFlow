import { Router } from "express";
import {
  getCurrentUserController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "./auth.controller.js";

logoutUserController;
const authRouter = Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.get("/me", getCurrentUserController);
authRouter.post("/logout", logoutUserController);

export default authRouter;
