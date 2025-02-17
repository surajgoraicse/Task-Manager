import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../utils/types.js";
import UserModel from "../models/user.model.js";

// NOTE: All the authenticated request body will contain the User model
// TODO: implement redis
const authenticate = asyncHandler(
	async (req: AuthenticatedRequest, Response: Response, next: NextFunction) => {
		const token =
			req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];
		if (!token) {
			return next(new ApiError(400, "Unauthorized , no access token"));
		}

		const user = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));

		if (!user || typeof user === "string") {
			return next(new ApiError(400, "Unauthorized  access token xxx"));
		}
		const userId = user?._id;

		const dbUser = await UserModel.findById(userId);
		if (!dbUser) {
			return next(new ApiError(400, "Unauthorized  access token yyy"));
		}

		req.user = dbUser;
		next();
	}
);

export default authenticate;
