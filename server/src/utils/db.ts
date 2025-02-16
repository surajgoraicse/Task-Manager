import mongoose from "mongoose";

const connectDb = async (uri: string) => {
	mongoose
		.connect(uri, { dbName: "task-manager" })
		.then((result) => {
			console.log("Database connected successfully : ", result.connection.host);
		})
		.catch((err) => {
			console.log("Database connection failed : ", err);
			process.exit(1);
		});
};

export default connectDb;
