import express from "express";
import { registerUser } from "../controllers/user.controllers.js";

const app = express.Router();

app.post("/create", registerUser);

export default app;
