import Lead from "../models/lead.js";
import { isAiConfigured } from "../services/ai.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandle } from "../utils/async-handler.js";

const resolveLead = asyncHandle(async (req, _res) => {
	if (req.body?.leadId) {
		const lead = await Lead.findOne({
			_id: req.body?.leadId,
			owner: req.user._id,
		});

		if (!lead) throw new APIError(404, "Lead not found");
		return lead;
	}
	if (req.body?.lead) return req.body.lead;
	throw new APIError(400, "Provide a leadId or an inline lead object");
});

export const aiStatus = asyncHandle(async (_req, res) => {
	return res.status(200).json({
		success: true,
		configured: isAiConfigured(),
		model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
	});
});
