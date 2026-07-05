import { Router } from "express";
import {
	createTask,
	deleteTask,
	getTasks,
	updatetask,
} from "../controllers/task.js";
import { authenticate } from "../middleware/authenticate.js";

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.route("/").get(getTasks).post(createTask);
taskRouter.route("/:id").patch(updatetask).delete(deleteTask);

export default taskRouter;
