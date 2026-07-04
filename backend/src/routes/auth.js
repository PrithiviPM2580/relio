import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getMe, login, register, updateProfile } from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, getMe);
authRouter.put("/profile", authenticate, updateProfile);

export default authRouter;
