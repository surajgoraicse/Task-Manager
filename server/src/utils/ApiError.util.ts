class ApiError extends Error {
	success = false;
	constructor(
		public statuCode: number,
		public message: string,
		public errors: string[] | string | Error = [],
		public data: any = ""
	) {
		super(message);
	}
}

export default ApiError
