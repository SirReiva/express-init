import { User } from 'application/model/user.model';

export const DI_IUseRepository = Symbol('IUseRepository');

export interface PageResult<T> {
	count: number;
	data: T[];
}

export interface IUserRepository {
	save(user: Omit<User, 'id'>): Promise<void>;
	update(user: User): Promise<void>;
	findByEmail(email: string): Promise<User | null>;
	findById(email: string): Promise<User | null>;
	find(page: number, size: number): Promise<PageResult<User>>;
}
