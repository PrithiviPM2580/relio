import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import aiRouter from "./routes/ai.js";
import analyticsRouter from "./routes/analytics.js";
import authRouter from "./routes/auth.js";
import contactRouter from "./routes/contact.js";
import leadRouter from "./routes/lead.js";
import noteRouter from "./routes/note.js";
import taskRouter from "./routes/task.js";

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
	}),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/", (_req, res) => {
	return res.json({
		success: true,
		message: "Relio API is working.",
	});
});

app.get("/health", (_req, res) => {
	return res.json({
		success: true,
		message: "Health is properly working.",
	});
});

app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/notes", noteRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/ai", aiRouter);
app.use("/api/analytics", analyticsRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server is runnign on the http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start the server", error.message);
		process.exit(1);
	}
};

startServer();

export default app;
