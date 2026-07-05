import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
	createLead,
	deleteLead,
	getLead,
	getLeads,
	reorderLeads,
	updateLead,
} from "../controllers/lead.js";

const leadRouter = Router();

leadRouter.use(authenticate);

leadRouter.patch("/reorder", reorderLeads);
leadRouter.route("/").get(getLeads).post(createLead);
leadRouter.route("/:id").get(getLead).patch(updateLead).delete(deleteLead);

export default leadRouter;
