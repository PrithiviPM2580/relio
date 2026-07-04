import { APIError } from "../utils/api-error";

export const notFound = (req, res, next) => {
	const error = new APIError(
		404,
		`Route not found: ${req.method} ${req.originalUrl}`,
	);
	next(error);
};

export const errorHandler = (err, req, res, next) => {
	let statusCode = err.statusCode || 500;
	let message = err.message || "Internal Server Error";

	if (err.name === "CastError") {
		statusCode = 400;
		message = `Invalid ${err.path}: ${err.value}`;
	}

	if (err.name === 11000) {
		statusCode = 400;
		const field = Object.keys(err.keyValue)[0];
		message = `Duplicate value for field: ${field}`;
	}

	if (err.name === "ValidationError") {
		statusCode = 400;
		const errors = Object.values(err.errors).map((el) => el.message);
		message = `Validation error: ${errors.join(", ")}`;
	}

	if (process.env.NODE_ENV !== "production" && statusCode === 500) {
		console.error(err);
	}

	res.status(statusCode).json({
		success: false,
		message,
		...(process.env.NODE_ENV !== "production" && statusCode === 500
			? { stack: err.stack }
			: {}),
	});
};
