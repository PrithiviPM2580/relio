import Note from "../models/note.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandle } from "../utils/async-handler.js";

export const getNotes = asyncHandle(async (req, res) => {
	const { lead, contact, search } = req.query;

	const filter = { owner: req.user._id };

	if (lead) filter.lead = lead;
	if (contact) filter.contact = contact;
	if (search) filter.search = new RegExp(search, "i");

	const notes = await Note.find(filter)
		.sort({ pinned: -1, createAt: -1 })
		.populate("lead", "name company")
		.populate("contact", "name company");

	return res.status(200).json({
		success: true,
		count: notes.length,
		notes,
	});
});

export const createNote = asyncHandle(async (req, res) => {
	const { contact, lead, content, pinned } = req.body;

	if (!content) {
		throw new APIError(400, "Note content is requird");
	}

	const note = await Note.create({
		owner: req.user._id,
		content,
		lead: lead || null,
		contact: contact || null,
		pinned: Boolean(pinned),
	});

	return res.status(201).json({
		success: true,
		note,
	});
});

export const updateNote = asyncHandle(async (req, res) => {
	const { owner, ...updates } = req.body;

	const note = await Note.findOneAndUpdate(
		{
			owner: req.user._id,
			_id: req.params.id,
		},
		updates,
		{ new: true, runValidators: true },
	);

	if (!note) throw new APIError(404, "Note not found");

	return res.status(201).json({
		success: true,
		note,
	});
});

export const deleteNote = asyncHandle(async (req, res) => {
	const note = await Note.findOneAndDelete({
		_id: req.params.id,
		owner: req.user._id,
	});

	if (!note) throw new APIError(404, "Note not found");

	return res.status(200).json({
		success: true,
		message: "Note deleted",
	});
});
