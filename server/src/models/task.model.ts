import mongoose, { Document, Schema, model } from "mongoose";

interface ITask extends Document {
	user: Schema.Types.ObjectId;
	category: Schema.Types.ObjectId;
	subject: Schema.Types.ObjectId;
	title: string;
	isCompleted: boolean;
	description: string;
}

const taskSchema = new Schema<ITask>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		subject: {
			type: Schema.Types.ObjectId,
			ref: "Subject",
			required: true,
		},
		title: {
			type: String,
			minlength: 10,
			maxlength: 30,
			trim: true,
			required: true,
		},
		description: {
			type: String,
			minlength: 10,
			maxlength: 150,
			trim: true,
			required: true,
			default: "write discription",
		},
		isCompleted: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

const taskModel = model<ITask>("Task", taskSchema);
export default taskModel