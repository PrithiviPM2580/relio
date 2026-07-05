import { Router } from "express";
import {
	createNote,
	deleteNote,
	getNotes,
	updateNote,
} from "../controllers/note.js";
import { authenticate } from "../middleware/authenticate.js";

const noteRouter = Router();

noteRouter.use(authenticate);

noteRouter.route("/").get(getNotes).post(createNote);
noteRouter.route("/:id").patch(updateNote).delete(deleteNote);

export default noteRouter;
