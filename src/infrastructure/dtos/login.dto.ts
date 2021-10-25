import { IsString } from 'class-validator';

export class LoginDTO {
	@IsString()
	token: string;
}
