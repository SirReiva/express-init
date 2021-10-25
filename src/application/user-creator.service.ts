import { inject, injectable } from 'inversify';
import { User } from './model/user.model';
import { hash } from 'bcrypt';
import {
	DI_IUseRepository,
	IUserRepository,
} from './repository/user.repository';

@injectable()
export class UserCreator {
	constructor(
		@inject(DI_IUseRepository)
		private readonly userRepository: IUserRepository
	) {}

	async execute(name: string, email: string, password: string) {
		const user: Omit<User, 'id'> = {
			name,
			email,
			password: await hash(password, 12),
		};

		await this.userRepository.save(user);
	}
}
