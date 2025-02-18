import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import { createTask, deleteTask } from "../controllers/task.controllers.js";

const app = express.Router();

// secure route
app.post("/create", authenticate, createTask);
app.delete("/:id", authenticate, deleteTask);
export default app;
