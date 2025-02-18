import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import { createSubject } from "../controllers/subject.controllers.js";

const app = express.Router();

// secure routes
app.post("/create", authenticate, createSubject);

export default app;
