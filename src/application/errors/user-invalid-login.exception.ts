import { HttpError } from '@Core/error';

export class UserInvalidLogin extends HttpError {
	constructor() {
		super(401, null, 'Login fail');
	}
}
