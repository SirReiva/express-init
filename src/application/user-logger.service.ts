import { inject, injectable } from 'inversify';
import { UserInvalidLogin } from './errors/user-invalid-login.exception';
import {
	DI_IUseRepository,
	IUserRepository,
} from './repository/user.repository';
import { compare } from 'bcrypt';

@injectable()
export class UserLogger {
	constructor(
		@inject(DI_IUseRepository)
		private readonly userRepository: IUserRepository
	) {}

	async execute(email: string, password: string): Promise<string> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) throw new UserInvalidLogin();

		try {
			compare(password, user.password);
		} catch {
			throw new UserInvalidLogin();
		}
		return user.id;
	}
}
