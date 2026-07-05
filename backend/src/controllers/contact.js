import Contact from "../models/contact.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandle } from "../utils/async-handler.js";

export const getContacts = asyncHandle(async (req, res) => {
	const { search, tag } = req.query;

	const filter = { owner: req.user._id };

	if (tag) filter.tags = tag;
	if (search) {
		const rx = new RegExp(search, "i");
		filter.$or = [{ name: rx }, { company: rx }, { email: rx }];
	}

	const contacts = await Contact.find(filter).sort({ favourite: -1, name: 1 });

	return res.status(200).json({
		success: true,
		count: contacts.length,
		contacts,
	});
});

export const getContact = asyncHandle(async (req, res) => {
	const contact = await Contact.findOne({
		_id: req.paramas.id,
		owner: req.user._id,
	});

	if (!contact) throw new APIError(404, "Contact not found");

	return res.status(200).json({
		success: true,
		contact,
	});
});

export const createContact = asyncHandle(async (req, res) => {
	const contact = await Contact.create({ ...req.body, owner: req.user._id });

	return res.status(201).json({
		success: true,
		contact,
	});
});

export const updateContact = asyncHandle(async (req, res) => {
	const { owner, ...updates } = req.body;

	const contact = await Contact.findOneAndUpdate(
		{
			_id: req.paramas.id,
			owner: req.user._id,
		},
		updates,
		{
			new: true,
			runValidators: true,
		},
	);

	if (!contact) throw new APIError(404, "Contact not found");

	return res.status(201).json({
		success: true,
		contact,
	});
});

export const deleteContact = asyncHandle(async (req, res) => {
	const contact = await Contact.findOneAndDelete({
		_id: req.paramas.id,
		owner: req.user._id,
	});

	if (!contact) throw new APIError(404, "Contact not found");

	return res.status(200).json({
		success: true,
		message: "Contact deleted",
	});
});
