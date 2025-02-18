import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import { createTask } from "../controllers/task.controllers.js";

const app = express.Router();

// secure route
app.post("/create", authenticate, createTask);
export default app;
