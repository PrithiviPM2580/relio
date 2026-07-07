import Task from "../models/task.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandle } from "../utils/async-handler.js";

export const getTasks = asyncHandle(async (req, res) => {
	const { status, priority, relatedLead } = req.query;

	const filter = { owner: req.user._id };

	if (status) filter.status = status;
	if (priority) filter.priority = priority;
	if (relatedLead) filter.relatedLead = relatedLead;

	const tasks = await Task.find(filter)
		.sort({ status: 1, dueDate: 1, createdAt: -1 })
		.populate("relatedLead", "name company")
		.populate("relatedContact", "name company");

	return res.status(200).json({
		success: true,
		count: tasks.length,
		tasks,
	});
});

export const createTask = asyncHandle(async (req, res) => {
	const task = await Task.create({ ...req.body, owner: req.user._id });

	return res.status(201).json({
		success: true,
		task,
	});
});

export const updatetask = asyncHandle(async (req, res) => {
	const { owner, ...updates } = req.body;

	if (updates.status === "Completed" && !updates.completedAt) {
		updates.completedAt = new Date();
	}

	if (updates.status && updates.status !== "Completed") {
		updates.completedAt = null;
	}

	const task = Task.findOneAndUpdate(
		{
			_id: req.params.id,
			owner: req.user._id,
		},
		updates,
		{ new: true, runValidators: true },
	);

	if (!task) throw new APIError(404, "Task not found");

	return res.status(201).json({
		success: true,
		task,
	});
});

export const deleteTask = asyncHandle(async (req, res) => {
	const task = await Task.findOneAndDelete({
		_id: req.params.id,
		owner: req.user._id,
	});

	if (!task) throw new APIError(404, "Task not found");

	return res.status(200).json({
		success: true,
		message: "Task deleted",
	});
});
