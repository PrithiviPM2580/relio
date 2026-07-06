import { Router } from "express";
import { getOverviews } from "../controllers/analytics.js";
import { authenticate } from "../middleware/authenticate.js";

const analyticsRouter = Router();

analyticsRouter.use(authenticate);

analyticsRouter.get("/overview", getOverviews);

export default analyticsRouter;
