import { inject, injectable } from 'inversify';
import { UserNotFound } from './errors/user-not-found.exception copy';
import {
	DI_IUseRepository,
	IUserRepository,
} from './repository/user.repository';

@injectable()
export class UserUpdater {
	constructor(
		@inject(DI_IUseRepository)
		private readonly userRepository: IUserRepository
	) {}

	async execute(id: string, name: string): Promise<void> {
		const user = await this.userRepository.findById(id);
		if (!user) throw new UserNotFound();

		user.name = name;

		await this.userRepository.update(user);
	}
}
