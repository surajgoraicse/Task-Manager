import mongoose, { Document, model, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
	username: string;
	password: string;
	fullname: string;
	email: string;
	firstname: string;
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

userSchema.virtual("firstname").get(function (this: IUser): string {
	return this.fullname.split(" ")[0];
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
