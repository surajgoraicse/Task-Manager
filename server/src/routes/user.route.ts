import express from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controllers.js";
import authenticate from "../middlewares/auth.middleware.js";

const app = express.Router();

app.post("/create", registerUser);
app.post("/login", loginUser);
// secure route
app.post("/logout", authenticate,  logout);
export default app;
