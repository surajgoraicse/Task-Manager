import mongoose, { Document, Schema, Types, model } from "mongoose";

interface ISubject extends Document {
	user: Schema.Types.ObjectId;
	category: Schema.Types.ObjectId;
	name: string;
	color: string;
}

const subjectSchema = new Schema<ISubject>(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 20,
		},
		color: {
			type: String,
			enum: ["000", "fff"],
			default: "000",
		},
	},
	{ timestamps: true }
);

const SubjectModel = model<ISubject>("Subject", subjectSchema);
export default SubjectModel;
