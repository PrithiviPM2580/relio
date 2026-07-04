import { Router } from "express";
import { getMe, login, register, updateProfile } from "../controllers/auth.js";
import { authenticate } from "../middleware/authenticate.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, getMe);
authRouter.put("/profile", authenticate, updateProfile);

export default authRouter;
