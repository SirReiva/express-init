import { inject, injectable } from 'inversify';
import { User } from './model/user.model';
import {
	DI_IUseRepository,
	IUserRepository,
	PageResult,
} from './repository/user.repository';

@injectable()
export class UserList {
	constructor(
		@inject(DI_IUseRepository)
		private readonly userRepository: IUserRepository
	) {}

	async execute(
		page: number,
		size: number
	): Promise<PageResult<Omit<User, 'password'>>> {
		const users = await this.userRepository.find(page, size);

		return {
			count: users.count,
			data: users.data.map(({ id, name, email }) => ({
				id,
				name,
				email,
			})),
		};
	}
}
