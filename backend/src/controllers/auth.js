import { token } from "morgan";
import User from "../models/user.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandle } from "../utils/async-handler.js";
import { generateToken } from "../utils/generate-token.js";

const toClientUser = (user) => ({
	id: user.id,
	name: user.name,
	email: user.email,
	role: user.role,
	company: user.comapany,
	avatar: user.avatar,
	createAt: user.createAt,
});

export const register = asyncHandle(async (req, res) => {
	const { name, email, password, company } = req.body;

	if (!name || !email || !password) {
		throw new APIError(400, "Name, Email and password are required");
	}

	const userExists = await User.findOne({ email: email.toLowerCase() });
	if (userExists) {
		throw new APIError(409, "An accoutn with this email already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
		company,
	});

	return res.status(201).json({
		success: true,
		token: generateToken(user._id),
		user: toClientUser(user),
	});
});

export const login = asyncHandle(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new APIError(400, "Email and Password are required");
	}

	const user = await User.findOne({ email: email.toLowerCase() }).select(
		"+password",
	);
	const hassedPassword = await user.matchPassword(password);

	if (!user || !hassedPassword) {
		throw new APIError(401, "Invalid email or password");
	}

	return res.status(201).json({
		success: true,
		token: generateToken(user._id),
		user: toClientUser(user),
	});
});

export const getMe = asyncHandle(async (req, res) => {
	return res.status(200).json({
		success: true,
		user: toClientUser(req.user),
	});
});

export const updateProfile = asyncHandle(async (req, res) => {
	const { name, company, avatar, password } = req.body;

	const user = req.user;

	if (name !== undefined) user.name = name;
	if (company !== undefined) user.company = company;
	if (avatar !== undefined) user.avatar = avatar;
	if (password !== undefined) user.password = password;

	await user.save();
	return res.status(201).json({
		success: true,
		user: toClientUser(user),
	});
});
