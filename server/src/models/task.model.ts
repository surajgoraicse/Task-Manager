import mongoose, { Document, Schema, model } from "mongoose";

interface ITask extends Document {
	createdBy: Schema.Types.ObjectId;
	category: Schema.Types.ObjectId;
	subject: Schema.Types.ObjectId;
	title: string;
	isCompleted: boolean;
	description: string;
	priority: "low" | "medium" | "high";
	dueDate: Date;
}

const taskSchema = new Schema<ITask>(
	{
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true
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
		priority: {
			type: String,
			required: true,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		dueDate: {
			type: Date,
			required: true,
			default: () => {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				return tomorrow;
			},
		},
	},
	{ timestamps: true }
);

const TaskModel = model<ITask>("Task", taskSchema);
export default TaskModel;
