import { model, Schema } from 'mongoose';

interface User {
	name: string;
	email: string;
	password: string;
}

const UserModel = model<User>(
	'User',
	new Schema<User>({
		name: { type: String, required: true },
		email: { type: String, required: true, index: true },
		password: { type: String, required: true },
	})
);

export default UserModel;
