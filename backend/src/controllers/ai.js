import Lead from "../models/lead.js";
import {
	generateEmail,
	generateLeadSummary,
	generateSlaesInsight,
	isAiConfigured,
} from "../services/ai.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandle } from "../utils/async-handler.js";

const buildPipelineStats = (leads) => {
	const byStage = {};
	let totalValue = 0;

	for (const l of leads) {
		byStage[l.status] = byStage[l.status] || { count: 0, value: 0 };
		byStage[l.status].count += 1;
		byStage[l.status].value += l.value || 0;
		totalValue += l.value || 0;
	}

	const won = byStage.Won?.count || 0;
	const lost = byStage.Lost?.count || 0;
	const closed = won + lost;

	return {
		totalLeads: leads.length,
		totalPipelineValue: totalValue,
		winRate: closed ? Math.round((won / closed) * 100) : 0,
		stages: byStage,
	};
};

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

export const leadSummary = asyncHandle(async (req, res) => {
	const lead = await resolveLead(req);

	const result = await generateLeadSummary(lead);

	if (req.body.leadId) {
		await Lead.updateOne(
			{ _id: req.body.leadId, owner: req.user._id },
			{ $set: { aiSummary: result.summary, aiRiskScore: result.riskScore } },
		);
	}

	return res.status(200).json({
		success: true,
		...result,
	});
});

export const generateEmailDraft = asyncHandle(async (req, res) => {
	const lead = await resolveLead(req);

	const { purpose, tone } = req.body;

	const result = await generateEmail({
		lead,
		purpose,
		tone,
		sender: {
			name: req.user.name,
			company: req.user.company,
		},
	});

	return res.status(200).json({
		success: true,
		...result,
	});
});

export const salesInsights = asyncHandle(async (req, res) => {
	let stats = req.body.stats;

	if (!stats) {
		const leads = await Lead.findOne({ owner: req.user._id });
		stats = await buildPipelineStats(leads);
	}

	const result = await generateSlaesInsight(stats);

	return res.status(200).json({
		success: true,
		...result,
	});
});
