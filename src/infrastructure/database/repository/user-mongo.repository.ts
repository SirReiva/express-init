import { User } from '@Application/model/user.model';
import {
	IUserRepository,
	PageResult,
} from '@Application/repository/user.repository';
import { injectable } from 'inversify';
import UserModel from '../models/user.model';

@injectable()
export class UserMongoRepository implements IUserRepository {
	async save(user: Omit<User, 'id'>): Promise<void> {
		const dbUser = new UserModel(user);
		await dbUser.save();
	}

	async findByEmail(email: string): Promise<User | null> {
		const userDB = await UserModel.findOne({ email }).exec();
		if (userDB)
			return {
				id: userDB.id.toString(),
				email: userDB.email,
				name: userDB.name,
				password: userDB.password,
			};

		return null;
	}

	async findById(id: string): Promise<User | null> {
		const userDB = await UserModel.findById(id).exec();
		if (userDB)
			return {
				id: userDB.id.toString(),
				email: userDB.email,
				name: userDB.name,
				password: userDB.password,
			};

		return null;
	}

	async update(user: User): Promise<void> {
		const { id, ...rest } = user;

		await UserModel.findByIdAndUpdate(id, rest);
	}

	async find(page: number, size: number): Promise<PageResult<User>> {
		const [result, count] = await Promise.all([
			UserModel.find({}, null, {
				limit: size,
				skip: page,
			}).exec(),
			UserModel.countDocuments().exec(),
		]);

		return {
			count,
			data: result.map(({ id, email, name, password }) => ({
				id: id.toString(),
				email,
				name,
				password,
			})),
		};
	}
}
