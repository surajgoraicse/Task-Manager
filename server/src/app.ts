import "dotenv/config";
import express, { Request, Response } from "express";
import connectDb from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import handleError from "./middlewares/handleError.middleware.js";

connectDb(process.env.MONGODB_URI!);

// express configuration
const app = express();
app.use(express.urlencoded({ limit: "100kb" }));
app.use(express.json({ limit: "100kb" }));
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(cookieParser());
app.on("error", (err) => {
	console.log("express error : ", err);
});
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
	res.send("<h1> hello worlld<h1/>");
});

// import router
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";

// using the routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);

app.use(handleError);
const port = process.env.PORT || 8001 || 8002;
app.listen(port, () => {
	console.log("app is listening at port : ", port);
});
