import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PaginatedQueryDTO {
	@Type(() => Number)
	@IsInt()
	page: number;

	@Type(() => Number)
	@IsInt()
	size: number;
}
