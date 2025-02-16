import "dotenv/config";
import express, { Request, Response } from "express";
import connectDb from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

connectDb(process.env.MONGODB_URI!);

// express configuration
const app = express();
app.use(express.urlencoded({ limit: "100kb" }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials: true
}));

app.get("/", (req: Request, res: Response) => {
	res.send("<h1> hello worlld<h1/>");
});

const port = process.env.PORT || 8001 || 8002;
app.listen(port, () => {
	console.log("app is listening at port : ", port);
});
