import mongoose, { Document, Schema, model } from "mongoose";

interface ICategory extends Document {
	name: string;
	color?: string;
	createdBy: Schema.Types.ObjectId;
	lastUpdatedSubject?: Schema.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
	{
		name: {
			type: String,
			required: [true, "Subject name is required"],
			maxlength: 20,
			minlength: 2,
			trim: true,
			unique: true,
		},
		color: {
			type: String,
			enum: ["fff", "000"],
			default: "fff",
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		lastUpdatedSubject: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subject",
		},
	},
	{ timestamps: true }
);

const categoryModel = model<ICategory>("Category", categorySchema);

export default categoryModel;
