import { ClassConstructor, Expose, Type } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';

export const PaginatedResponse = <T>(
	type: ClassConstructor<T>
): ClassConstructor<T> => {
	class PaginatedResponse {
		@IsInt()
		count: number;
		@Type(() => type)
		@IsArray()
		@Expose()
		data: T[];
	}

	return PaginatedResponse as any;
};
