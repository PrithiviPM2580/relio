import { Router } from "express";
import {
	aiStatus,
	generateEmailDraft,
	leadSummary,
	salesInsights,
} from "../controllers/ai.js";
import { authenticate } from "../middleware/authenticate.js";

const aiRouter = Router();

aiRouter.use(authenticate);

aiRouter.get("/status", aiStatus);
aiRouter.post("/lead-summary", leadSummary);
aiRouter.post("/generate-email", generateEmailDraft);
aiRouter.post("/sales-insights", salesInsights);

export default aiRouter;
