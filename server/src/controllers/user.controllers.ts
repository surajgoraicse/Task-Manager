import express, { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { AuthenticatedRequest } from "../utils/types.js";
import { userValidation } from "../schemas/userSchema.js";
import ApiError from "../utils/ApiError.util.js";
import UserModel, { IUser } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import { cookieOptions } from "../utils/constants.js";

// refresh token
// create account
// login
// logout
//

const generateToken = async (user: IUser) => {
	try {
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;
		user.save({ validateBeforeSave: false });
		// whenever a value is updated in the user model, the properties with required filed gets activated. So to pass this, mongoose provide a property to skip validation
		return { accessToken, refreshToken };
	} catch (error) {
		// TODO: send token generation failed response
		throw new ApiError(
			500,
			"Something went wrong while generating refresh and access token"
		);
	}
};

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
export const loginUser = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		// take data from body
		// validate
		// check db
		// check password
		// generate token access token and refresh
		// store access and refresh token cookie in user browser and refresh token in db
		// send cookie

		const { username, password } = req.body;
		if (!username || !password) {
			return res
				.status(400)
				.json(new ApiResponse(400, false, "salee login data provide karo"));
		}

		const user = await UserModel.findOne({ username }).select("+password");
		if (!user) {
			return res
				.status(404)
				.json(new ApiResponse(404, false, "user not found"));
		}
		const compare = await user.comparePassword(password, user.password);
		console.log("compare : ", compare);
		if (!compare) {
			return res
				.status(401)
				.json(new ApiResponse(401, false, "Incorrect password"));
		}
		const { accessToken, refreshToken } = await generateToken(user);

		res
			.status(200)
			.cookie("accessToken", accessToken, cookieOptions)
			.cookie("refreshToken", refreshToken, cookieOptions)
			.json(new ApiResponse(200, true, "user login successfully"));
	}
);

export const logout = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		/**
		 * get user
		 * empty refresh token
		 * clear cookie
		 */
		const user = req.user;
		if (!user) {
			return res
				.status(400)
				.json(new ApiResponse(400, false, "user not found"));
		}
		user.refreshToken = "";
		user.save({ validateBeforeSave: false });

		res
			.status(200)
			.clearCookie("accessToken", cookieOptions)
			.clearCookie("refreshToken", cookieOptions)
			.json(new ApiResponse(200, true, "user logout successfully"));
	}
);
