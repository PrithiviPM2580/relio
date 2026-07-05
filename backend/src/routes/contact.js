import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
	createContact,
	deleteContact,
	getContact,
	getContacts,
	updateContact,
} from "../controllers/contact.js";

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.route("/").get(getContacts).post(createContact);
contactRouter
	.route("/:id")
	.get(getContact)
	.patch(updateContact)
	.delete(deleteContact);

export default contactRouter;
