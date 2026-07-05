import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
	createNote,
	deleteNote,
	getNotes,
	updateNote,
} from "../controllers/note.js";

const noteRouter = Router();

noteRouter.use(authenticate);

noteRouter.route("/").get(getNotes).post(createNote);
noteRouter.route("/:id").patch(updateNote).delete(deleteNote);

export default noteRouter;
