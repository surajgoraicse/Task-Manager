import mongoose, { Document, model, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
	username: string;
	password: string;
	fullname: string;
	email: string;
	firstname: string;
	refreshToken: string;
	comparePassword(password: string): Promise<boolean>;
	changePassword(prevPassword: string): void;
}

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: [true, "username is required"],
			lowercase: true,
			unique: [true, "username has to be unique "],
			trim: true,
		},
		password: {
			type: String,
			required: [true, "username is required"],
			trim: true,
			select: false,
		},
		fullname: {
			type: String,
			required: [true, "fullname is required"],
			trim: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: [true, "email is required"],
			trim: true,
			lowercase: true,
			unique: [true, "email has to be unique "],
			match: [/^[\w.-]+@[\w.-]+\.[a-z]{2,4}$/, "Invalid email"],
		},
		refreshToken: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (this: IUser, next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

userSchema.methods.comparePassword = function (
	password: string
): Promise<boolean> {
	return bcrypt.compare(password, this.password);
};

userSchema.methods.changePassword = function (
	this: IUser,
	prevPassword: string
) {
	this.password = prevPassword;
};

userSchema.methods.generateAccessToken = function (this: IUser) {
	if (!process.env.ACCESS_TOKEN_SECRET) {
		throw new Error("Missing ACCESS_TOKEN_SECRET");
	}
	return jwt.sign(
		{ userId: this._id, email: this.email },
		String(process.env.ACCESS_TOKEN_SECRET),
		{
			expiresIn: "1d",
		}
	);
};
userSchema.methods.generateRefreshToken = function (this: IUser) {
	if (!process.env.REFRESH_TOKEN_SECRET) {
		throw new Error("Missing REFRESH_TOKEN_SECRET .");
	}
	return jwt.sign(
		{ userId: this._id, email: this.email },
		String(process.env.REFRESH_TOKEN_SECRET),
		{
			expiresIn: "10d",
		}
	);
};

userSchema.virtual("firstname").get(function (this: IUser): string {
	return this.fullname.split(" ")[0];
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
