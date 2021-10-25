import { inject, injectable } from 'inversify';
import { UserNotFound } from './errors/user-not-found.exception copy';
import { User } from './model/user.model';
import {
	DI_IUseRepository,
	IUserRepository,
} from './repository/user.repository';

@injectable()
export class UserFinder {
	constructor(
		@inject(DI_IUseRepository)
		private readonly userRepository: IUserRepository
	) {}

	async execute(id: string): Promise<Omit<User, 'password'>> {
		const user = await this.userRepository.findById(id);
		if (!user) throw new UserNotFound();
		return {
			id: user.id,
			email: user.email,
			name: user.name,
		};
	}
}
