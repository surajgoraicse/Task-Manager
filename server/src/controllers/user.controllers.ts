import express, { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { AuthenticatedRequest } from "../utils/types.js";
import { userValidation } from "../schemas/userSchema.js";
import ApiError from "../utils/ApiError.util.js";
import UserModel from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.util.js";

// refresh token
// create account
// login
// logout
//


export const registerUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { username, password, fullname, email } = req.body;
		const validate = userValidation.safeParse({
			username,
			password,
			fullname,
			email,
		});

		if (!validate?.success) {
			return res
				.status(400)
				.json(
					new ApiResponse(
						400,
						false,
						"request data validation failed",
						validate.error.format()
					)
				);
		}

		const checkIfAlreadyExists = await UserModel.find({
			$or: [{ username }, { email }],
		});

		if (checkIfAlreadyExists.length !== 0) {
			return next(new ApiError(400, "user with same email or username exists"));
		}

		const newUser = await UserModel.create(validate.data);
		if (!newUser) {
			return next(
				new ApiError(500, "user creation failed due to server error")
			);
		}
		const newUserFromDb = await UserModel.findById(newUser._id);
		return res
			.status(201)
			.json(
				new ApiResponse(201, true, "user created succesfully", newUserFromDb)
			);
	}
);


// authenticated req object contains user model

export const loginUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // take data from body
    // validate
    // check db
    // generate token access token and refresh
    // store access and refresh token cookie in user browser and refresh token in db
    //
})