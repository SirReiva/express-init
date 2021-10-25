export class HttpError extends Error {
	constructor(
		public readonly status: number,
		public readonly data: any,
		message: string
	) {
		super(message);
	}
}
