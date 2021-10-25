import { HttpError } from '@Core/error';

export class UserNotFound extends HttpError {
	constructor() {
		super(404, null, 'User not found');
	}
}
