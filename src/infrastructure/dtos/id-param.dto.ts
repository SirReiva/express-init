import { IsString } from 'class-validator';

export class IdParamDTO {
	@IsString()
	id: string;
}
