import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandle } from "../utils/async-handler.js";

export const authenticate = asyncHandle(async (req, _res, next) => {
	let token;

	const header = req.headers?.authorizations;

	if (header?.startsWith("Bearer ")) {
		token = header.split(" ")[1];
	}

	if (!token) {
		throw new APIError(401, "Not authorized, no token provided");
	}

	let decode;

	try {
		decode = jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		throw new APIError(401, "Not authorized, token invalid or expired");
	}

	const user = await User.findById(decode.id);

	if (!user) {
		throw new APIError(401, "Not authorized, user no longer exist");
	}

	req.user = user;
	next();
});
