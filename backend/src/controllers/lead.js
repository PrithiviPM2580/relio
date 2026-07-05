import Lead from "../models/lead.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandle } from "../utils/async-handler.js";

export const getLeads = asyncHandle(async (req, res) => {
	const { status, priority, source, search } = req.query;

	const filter = {
		owner: req.user._id,
	};
	// Apply filters
	if (status) filter.status = status;
	if (priority) filter.priority = priority;
	if (source) filter.source = source;

	// Search
	if (search) {
		const rx = new RegExp(search, "i");
		filter.$or = [{ name: rx }, { email: rx }, { company: rx }];
	}

	// Fetch and sort from MongoDB
	const leads = await Lead.find(filter).sort({ order: 1, createdAt: -1 });

	return res.status(200).json({
		success: true,
		count: leads.length,
		leads,
	});
});

export const getLead = asyncHandle(async (req, res) => {
	const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
	if (!lead) throw new APIError(404, "Lead not found");
	return res.status(200).json({
		success: true,
		lead,
	});
});

export const createLead = asyncHandle(async (req, res) => {
	const lead = await Lead.create({ ...req.body, owner: req.user._id });
	return res.status(201).json({
		success: true,
		lead,
	});
});

export const updateLead = asyncHandle(async (req, res) => {
	const { owner, ...updates } = req.body;

	const lead = await Lead.findOneAndUpdate(
		{
			_id: req.params.id,
			owner: req.user._id,
		},
		updates,
		{ new: true, runValidators: true },
	);

	if (!lead) throw new APIError(404, "Lead not found");

	return res.status(201).json({
		success: true,
		lead,
	});
});

export const deleteLead = asyncHandle(async (req, res) => {
	const lead = await Lead.findOneAndDelete({
		_id: req.params.id,
		owner: req.user._id,
	});
	if (!lead) throw new APIError(404, "Lead not found");
	return res.status(200).json({
		success: true,
		message: "Lead deleted",
	});
});

export const reorderLeads = asyncHandle(async (req, res) => {
	const { updates } = req.body;

	if (!Array.isArray(updates)) {
		throw new APIError(400, "Updates must be an array");
	}

	await Promise.all(
		updates.map((u) =>
			Lead.updateOne(
				{ _id: u.id, owner: req.user._id },
				{ $set: { status: u.status, order: u.order } },
			),
		),
	);

	return res.status(200).json({
		success: true,
		message: "Pipeline updated",
	});
});
