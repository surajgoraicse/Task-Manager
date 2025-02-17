import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import { createCategory } from "../controllers/category.controllers.js";

const app = express.Router();

// secure routes
app.post("/create", authenticate, createCategory);

export default app;
