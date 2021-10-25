import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { UserDTO } from './user.dto';

export class PaginatedUserResponseDTO {
	@IsInt()
	count: number;
	@IsArray()
	@Type(() => UserDTO)
	@ValidateNested({ each: true })
	data: UserDTO[];
}
