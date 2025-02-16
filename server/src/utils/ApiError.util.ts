// use this for loging error in the console 
// do not use this for making api response

class ApiError extends Error {
	success = false;
	constructor(
		public statuCode: number,
		public message: string,
		public errors: any = [],
		public data: any = ""
	) {
		super(message);
	}
}

export default ApiError
